"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import RichTextEditor from './RichTextEditor';
import { useAuth } from '@/context/AuthContext';
import { validateComment } from '@/lib/utils/comment-validation';
import { csrfFetch } from '@/lib/utils/csrf';

export default function CommentForm({ mediaId, mediaType, season, episode, onCommentAdded }) {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('<p></p>');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef(null);
  const MAX_CHARS = 1000;

  const validation = useMemo(() => {
    if (content === '<p></p>') return { isValid: false, error: '' };
    const v = validateComment(content);
    const count = content.replace(/<[^>]*>/g, '').length;
    setCharCount(count);
    
    if (!v.isValid) return v;
    if (count > MAX_CHARS) return { isValid: false, error: 'Comment is too long' };
    return { isValid: true, error: '' };
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validation.isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');

      const response = await csrfFetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaId,
          mediaType,
          content,
          season: mediaType === 'tv' ? season : undefined,
          episode: mediaType === 'tv' ? episode : undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      const newComment = await response.json();
      if (editorRef.current) editorRef.current.clear();
      setContent('<p></p>');
      
      if (onCommentAdded) {
        onCommentAdded({
          ...newComment,
          user: user,
          replies: [],
          _count: { likes: 0 },
          isLiked: false,
          flagged: false,
          parentId: null
        });
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
      <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <RichTextEditor
              ref={editorRef}
              content={content}
              onInput={setContent}
              className="min-h-[120px] bg-gray-900/50"
            />

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">
                {charCount}/{MAX_CHARS} characters
              </span>
              {(error || validation.error) && (
                <span className="text-red-400">{error || validation.error}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-widest text-[10px]"
              disabled={!validation.isValid || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-400">Please <a href="/login" className="text-primary-500 hover:underline">log in</a> to leave a comment.</p>
        </div>
      )}
    </div>
  );
}
