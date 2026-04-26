"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Image({ src, alt, className = '', sizes = '100vw' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef(null);

  const placeholder = '/placeholder.jpg';

  function generateSrcSet(path) {
    const widths = [300, 500, 700, 900, 1100];
    return widths
      .map(width => {
        const size = width <= 500 ? 'w500' : width <= 700 ? 'w780' : 'original';
        return `/api/image/${size}${path} ${width}w`;
      })
      .join(', ');
  }

  function isFullUrl(path) {
    return path.startsWith('http://') || path.startsWith('https://');
  }

  const finalSrc = src ? (isFullUrl(src) ? src : `/api/image/w500${src}`) : placeholder;
  const srcset = src && !isFullUrl(src) ? generateSrcSet(src) : '';

  useEffect(() => {
    if (src) {
      setLoaded(false);
      setError(false);
    }
  }, [src]);

  const handleLoad = () => setLoaded(true);
  const handleError = () => {
    setError(true);
    if (imageRef.current) {
      imageRef.current.src = placeholder;
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imageRef}
        src={finalSrc}
        srcSet={srcset}
        sizes={sizes}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${!loaded ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />

      {!loaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
      )}
    </div>
  );
}
