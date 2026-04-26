"use client";

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useMemo, useCallback } from 'react';
import { useProviders } from '@/context/ProviderContext';
import CustomPlayer from './CustomPlayer';

const VideoPlayer = forwardRef(({ mediaId, mediaType, title, season, episode }, ref) => {
  const { providers, getEmbedUrl } = useProviders();
  
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [resolvedStreamUrl, setResolvedStreamUrl] = useState(null);
  const iframeRef = useRef(null);

  // Initialize selected provider from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem("selectedProvider");
    if (saved && providers?.find(p => p.id === saved)) {
      setSelectedProviderId(saved);
    } else if (providers?.length > 0) {
      setSelectedProviderId(providers[0].id);
    }
  }, [providers]);

  const selectedProvider = useMemo(() => 
    providers?.find(p => p.id === selectedProviderId) || providers?.[0]
  , [providers, selectedProviderId]);

  const embedUrl = useMemo(() => {
    if (!selectedProviderId || !getEmbedUrl) return "";
    return getEmbedUrl(selectedProviderId, mediaId, mediaType, season, episode);
  }, [selectedProviderId, getEmbedUrl, mediaId, mediaType, season, episode]);

  // Logic to resolve direct stream URLs for our custom player
  useEffect(() => {
    if (embedUrl?.startsWith('neural://')) {
      const resolveStream = async () => {
        setLoading(true);
        setError(null);
        try {
          const urlObj = new URL(embedUrl.replace('neural://', 'http://unused.com/'));
          const id = urlObj.searchParams.get('id');
          const type = urlObj.searchParams.get('type');
          
          const res = await fetch(`/api/resolve?id=${id}&type=${type}`);
          const data = await res.json();
          
          if (data.url) {
            setResolvedStreamUrl(data.url);
            setLoading(false);
          } else {
            throw new Error("No direct stream found");
          }
        } catch (err) {
          console.error("Resolution error:", err);
          handleError();
        }
      };
      resolveStream();
    } else {
      setResolvedStreamUrl(null);
    }
  }, [embedUrl]);

  // ANTI-REDIRECT SCRIPT: Powerful global guard to prevent invasive redirects
  useEffect(() => {
    if (!resolvedStreamUrl && embedUrl) {
      const handleBeforeUnload = (e) => {
        // Intercept any attempt from the iframe player to force-leave the current page
        e.preventDefault();
        e.returnValue = "Neural Sync: Redirect attempt blocked. Continue watching?";
        return e.returnValue;
      };

      // Also trap pop-state to prevent stealth redirect patterns
      const handlePopState = (e) => {
        window.history.pushState(null, "", window.location.href);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [embedUrl, resolvedStreamUrl]);

  const tryNextProvider = useCallback(() => {
    if (!providers) return;
    const currentIndex = providers.findIndex(p => p.id === selectedProviderId);
    const nextIndex = (currentIndex + 1) % providers.length;
    const nextProvider = providers[nextIndex];
    setSelectedProviderId(nextProvider.id);
    localStorage.setItem('selectedProvider', nextProvider.id);
    setLoading(true);
    setError(null);
  }, [providers, selectedProviderId]);

  const handleError = useCallback(() => {
    if (retryCount < (providers?.length || 0)) {
      setRetryCount(prev => prev + 1);
      tryNextProvider();
    } else {
      setLoading(false);
      setError('Failed to load video player after trying all providers. Please try again later.');
    }
  }, [retryCount, providers, tryNextProvider]);

  useEffect(() => {
    const handleProviderMessage = (event) => {
      if (event.data?.type === 'error') {
        handleError();
      }
    };

    window.addEventListener('message', handleProviderMessage);
    return () => window.removeEventListener('message', handleProviderMessage);
  }, [handleError]);

  useImperativeHandle(ref, () => ({
    changeProvider: (providerId) => {
      setSelectedProviderId(providerId);
      localStorage.setItem('selectedProvider', providerId);
      setLoading(true);
      setError(null);
      setRetryCount(0);
    }
  }));

  const handleIframeLoad = () => {
    setLoading(false);
    setRetryCount(0);
  };

  const handleIframeError = () => {
    handleError();
  };

  if (!selectedProvider) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Premium Server Dropdown Header */}
      <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl relative z-50">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
             <span className="text-xs font-black text-primary-500 uppercase tracking-widest">Streaming Server</span>
             <div className="h-1 w-1 rounded-full bg-gray-600"></div>
             <span className="text-xs text-gray-400 font-medium">Auto-scaling enabled</span>
          </div>
          <h3 className="text-white font-bold text-lg">{selectedProvider.name}</h3>
        </div>

        <div className="relative">
          <button 
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all group shadow-inner"
          >
            <span className="text-sm font-semibold text-white">Change Server</span>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-64 bg-gray-950 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden z-[100]">
              <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                <span className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">Select Database</span>
              </div>
              <div className="max-h-[320px] overflow-y-auto py-2 no-scrollbar">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all group ${selectedProviderId === provider.id ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    onClick={() => {
                      setSelectedProviderId(provider.id);
                      localStorage.setItem('selectedProvider', provider.id);
                      setLoading(true);
                      setError(null);
                      setRetryCount(0);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedProviderId === provider.id ? 'bg-primary-500 shadow-[0_0_8px_#E50914]' : 'bg-transparent group-hover:bg-gray-600'}`}></div>
                      <span className="font-bold">{provider.name}</span>
                    </div>
                    {selectedProviderId === provider.id && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="p-3 bg-primary-600/10 text-center">
                <p className="text-[10px] text-primary-400 font-medium tracking-tight">Try alternate servers for different languages</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl group/player pb-[56.25%]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/90 backdrop-blur-sm z-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Establishing Connection...</p>
          </div>
        )}

        {embedUrl && (
          <iframe
            ref={iframeRef}
            title={title}
            src={embedUrl}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
            frameBorder="0"
            scrolling="no"
            allowFullScreen={true}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          ></iframe>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
            <div className="text-red-500 text-center p-4">
              <p className="mb-2 text-sm font-bold uppercase tracking-tight">{error}</p>
              <button
                type="button"
                className="px-6 py-2.5 bg-primary-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-primary-700 transition-all shadow-xl active:scale-95"
                onClick={() => {
                  setRetryCount(0);
                  tryNextProvider();
                }}
              >
                Try Alternate Server
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
