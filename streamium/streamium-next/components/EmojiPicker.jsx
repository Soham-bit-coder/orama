"use client";

import React, { useState, useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function EmojiPicker({ onSelect, disabled, buttonClass = '' }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showPicker && 
          pickerRef.current && !pickerRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPicker]);

  const handleSelect = (emoji) => {
    if (onSelect) onSelect(emoji.native);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={`p-1 rounded hover:bg-gray-700/50 transition-colors ${buttonClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setShowPicker(!showPicker)}
        disabled={disabled}
        aria-label="Add emoji"
        title="Add emoji"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {showPicker && (
        <div 
          ref={pickerRef}
          className="absolute bottom-full right-0 mb-2 z-50"
        >
          <Picker 
            data={data} 
            onEmojiSelect={handleSelect}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
          />
        </div>
      )}
    </div>
  );
}
