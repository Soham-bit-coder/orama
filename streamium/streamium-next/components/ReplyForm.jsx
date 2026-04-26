"use client";

import React, { useState, useMemo, useRef } from 'react';
import RichTextEditor from './RichTextEditor';
import { useAuth } from '@/context/AuthContext';
import { validateComment } from '@/lib/utils/comment-validation';
import { csrfFetch } from '@/lib/utils/csrf';

export default function ReplyForm({ mediaId, mediaType, season, episode, parentId, onReplyAdded, onCancel }) {
  const { user } = useAuth();
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
    if (count > MAX_CHARS) return { isValid: false, error: 'Reply is too long' };
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
          parentId,
          season: mediaType === 'tv' ? season : undefined,
          episode: mediaType === 'tv' ? episode : undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post reply');
      }

      const newReply = await response.json();
      if (editorRef.current) editorRef.current.clear();
      setContent('<p></p>');
      
      if (onReplyAdded) {
        onReplyAdded({
          ...newReply,
          user: user,
          replies: [],
          _count: { likes: 0 },
          isLiked: false,
          flagged: false,
          parentId: parentId
        });
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <RichTextEditor
          ref={editorRef}
          content={content}
          onInput={setContent}
          className="min-h-[100px] bg-gray-900/50"
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

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors uppercase tracking-widest text-[10px] font-bold"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px] font-bold"
          disabled={!validation.isValid || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
}
