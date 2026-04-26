"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';
import ReplyForm from './ReplyForm';
import CommentForm from './CommentForm';
import { csrfFetch } from '@/lib/utils/csrf';

export default function CommentList({ mediaId, mediaType, season, episode }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [replyingToId, setReplyingToId] = useState(null);

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      if (sortBy === 'likes') {
        const aLikes = a._count?.likes || 0;
        const bLikes = b._count?.likes || 0;
        return bLikes - aLikes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [comments, sortBy]);

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      let url = `/api/comments?mediaId=${mediaId}&mediaType=${mediaType}`;
      if (mediaType === 'tv' && season !== undefined && episode !== undefined) {
        url += `&season=${season}&episode=${episode}`;
      }
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (e) {
      console.error('Error loading comments:', e);
      setError(e.message || 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [mediaId, mediaType, season, episode]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleLike = async (commentId) => {
    if (!isAuthenticated) return;

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.isLiked;
        return {
          ...c,
          isLiked,
          _count: { ...c._count, likes: (c._count?.likes || 0) + (isLiked ? 1 : -1) }
        };
      }
      if (c.replies?.length) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === commentId) {
              const isLiked = !r.isLiked;
              return {
                ...r,
                isLiked,
                _count: { ...r._count, likes: (r._count?.likes || 0) + (isLiked ? 1 : -1) }
              };
            }
            return r;
          })
        };
      }
      return c;
    }));

    try {
      const response = await csrfFetch('/api/comments/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });

      if (!response.ok) {
        // Revert on error
        loadComments();
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to like comment');
      }
    } catch (e) {
      console.error('Error liking comment:', e);
    }
  };

  const handleFlag = async (commentId) => {
    if (!isAuthenticated) return;

    const reason = prompt('Please provide a reason for reporting this comment:');
    if (reason === null) return;

    try {
      const response = await csrfFetch(`/api/comments/${commentId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to flag comment');
      }
      
      alert('Comment reported. Thank you for keeping Orama safe.');
      setComments(prev => prev.map(c => {
        if (c.id === commentId) return { ...c, flagged: true };
        if (c.replies?.length) {
          return {
            ...c,
            replies: c.replies.map(r => r.id === commentId ? { ...r, flagged: true } : r)
          };
        }
        return c;
      }));
    } catch (e) {
      console.error('Error flagging comment:', e);
    }
  };

  const sanitizeContent = (content) => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'br'],
      ALLOWED_ATTR: []
    });
  };

  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return 'just now';
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleReplyAdded = (newReply) => {
    setComments(prev => prev.map(c => {
      if (c.id === newReply.parentId) {
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    }));
    setReplyingToId(null);
  };

  return (
    <div className="space-y-6">
      <CommentForm
        mediaId={mediaId}
        mediaType={mediaType}
        season={season}
        episode={episode}
        onCommentAdded={handleCommentAdded}
      />

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>Sort by:</span>
        <button
          className={`hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black ${sortBy === 'recent' ? 'text-white' : ''}`}
          onClick={() => setSortBy('recent')}
        >
          Most Recent
        </button>
        <span>•</span>
        <button
          className={`hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black ${sortBy === 'likes' ? 'text-white' : ''}`}
          onClick={() => setSortBy('likes')}
        >
          Most Liked
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400 font-bold">{error}</p>
          <button
            className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors uppercase text-[10px] font-black"
            onClick={loadComments}
          >
            Try Again
          </button>
        </div>
      ) : sortedComments.length === 0 ? (
        <div className="bg-gray-800/50 rounded-lg p-8 text-center backdrop-blur-sm border border-gray-700/50">
          <div className="flex flex-col items-center gap-4 opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div>
              <p className="text-gray-400 text-lg mb-2 font-black uppercase tracking-tighter">No neural conversations found</p>
              <p className="text-gray-500 text-sm font-medium">Be the first to synchronize your thoughts!</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            !comment.parentId && (
              <div key={comment.id} className="bg-gray-800/50 rounded-3xl p-6 backdrop-blur-sm border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600/20 text-primary-400 rounded-full flex items-center justify-center font-black">
                      {comment.user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-white uppercase tracking-tight text-sm">{comment.user.username}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeContent(comment.content) }}
                />

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
                  <button
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${comment.isLiked ? 'text-primary-500' : 'text-gray-500 hover:text-primary-400'}`}
                    onClick={() => handleLike(comment.id)}
                    disabled={!isAuthenticated}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>{comment._count?.likes || 0}</span>
                  </button>

                  {isAuthenticated && (
                    <button
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-400 transition-colors"
                      onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span>Reply</span>
                    </button>
                  )}

                  {isAuthenticated && !comment.flagged && (
                    <button
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => handleFlag(comment.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      <span>Report</span>
                    </button>
                  )}
                </div>

                {replyingToId === comment.id && (
                  <div className="mt-6 ml-6 md:ml-10">
                    <ReplyForm
                      mediaId={mediaId}
                      mediaType={mediaType}
                      season={season}
                      episode={episode}
                      parentId={comment.id}
                      onReplyAdded={handleReplyAdded}
                      onCancel={() => setReplyingToId(null)}
                    />
                  </div>
                )}

                {comment.replies?.length > 0 && (
                  <div className="mt-6 ml-6 md:ml-10 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-white/3 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-primary-600/10 text-primary-400 rounded-full flex items-center justify-center font-black text-xs">
                            {reply.user.username[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-black text-white uppercase tracking-tight text-xs">{reply.user.username}</div>
                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                              {formatDate(reply.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div 
                          className="prose prose-invert max-w-none text-gray-400 text-xs leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: sanitizeContent(reply.content) }}
                        />
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                          <button
                            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors ${reply.isLiked ? 'text-primary-500' : 'text-gray-500 hover:text-primary-400'}`}
                            onClick={() => handleLike(reply.id)}
                            disabled={!isAuthenticated}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>{reply._count?.likes || 0}</span>
                          </button>

                          {isAuthenticated && !reply.flagged && (
                            <button
                              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors"
                              onClick={() => handleFlag(reply.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                              </svg>
                              <span>Report</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
