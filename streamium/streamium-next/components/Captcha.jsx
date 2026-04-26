"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { csrfFetch } from '@/lib/utils/csrf';

export default function Captcha({ onVerify, required = true }) {
  const [captchaId, setCaptchaId] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const canvasRef = useRef(null);

  const renderCaptcha = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !captchaText) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, 0,
      canvas.width/2, canvas.height/2, canvas.width/2
    );
    gradient.addColorStop(0, '#1a1e2d');
    gradient.addColorStop(0.5, '#1f2937');
    gradient.addColorStop(1, '#1a1e2d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative lines
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const startY = Math.random() * canvas.height;
      const endY = Math.random() * canvas.height;
      const controlY = Math.random() * canvas.height;
      ctx.moveTo(0, startY);
      ctx.quadraticCurveTo(canvas.width/2, controlY, canvas.width, endY);
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
      ctx.lineWidth = 15;
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 150; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.fill();
    }

    const charsArray = captchaText.split('');
    const charWidth = canvas.width / (charsArray.length + 1);

    charsArray.forEach((char, i) => {
      ctx.save();
      const x = charWidth * (i + 0.8) + (Math.random() - 0.5) * 15;
      const y = canvas.height / 2 + (Math.random() - 0.5) * 20;

      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.8);

      const fonts = ['Arial Black', 'Impact', 'Verdana', 'Times New Roman'];
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
      const fontSize = Math.floor(Math.random() * 10) + 28;
      ctx.font = `bold ${fontSize}px ${randomFont}`;

      // Character shadows
      for (let j = 0; j < 2; j++) {
        ctx.shadowColor = `rgba(0, 0, 0, ${0.2 + Math.random() * 0.3})`;
        ctx.shadowBlur = 4 + Math.random() * 4;
        ctx.shadowOffsetX = (Math.random() - 0.5) * 6;
        ctx.shadowOffsetY = (Math.random() - 0.5) * 6;
        ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`;
        ctx.fillText(char, 0, 0);
      }

      const brightness = Math.random() * 100 + 120;
      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      ctx.transform(1, Math.random() * 0.3 - 0.15, Math.random() * 0.3 - 0.15, 1, 0, 0);
      ctx.fillText(char, 0, 0);

      ctx.restore();
    });
  }, [captchaText]);

  const fetchCaptcha = useCallback(async () => {
    setLoading(true);
    setVerified(false);
    setUserInput('');

    try {
      const response = await fetch('/api/captcha');
      if (!response.ok) throw new Error('Failed to fetch captcha');
      const data = await response.json();
      setCaptchaId(data.id);
      setCaptchaText(data.text);
    } catch (error) {
      console.error('Error fetching captcha:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (captchaText) renderCaptcha();
  }, [captchaText, renderCaptcha]);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const verifyCaptcha = async () => {
    if (!userInput || !captchaId) {
      if (onVerify) onVerify({ valid: false, captchaId: '', answer: '' });
      return;
    }

    try {
      const response = await csrfFetch('/api/captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: captchaId, answer: userInput }),
      });

      const result = await response.json();
      setVerified(result.valid);

      if (onVerify) {
        onVerify({
          valid: result.valid,
          captchaId,
          answer: userInput
        });
      }

      if (!result.valid) await fetchCaptcha();
    } catch {
      if (onVerify) onVerify({ valid: false, captchaId: '', answer: '' });
      await fetchCaptcha();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <canvas
          ref={canvasRef}
          width="200"
          height="60"
          className="border border-white/10 rounded-2xl bg-black/40 shadow-inner"
          aria-label="CAPTCHA image"
        ></canvas>
        <button
          type="button"
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50 border border-white/5"
          onClick={fetchCaptcha}
          disabled={loading}
          aria-label="Generate new CAPTCHA"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
        {verified && (
          <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="captcha-input" className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">
          Human Verification Pulse
          {required && <span className="text-primary-500 ml-1">*</span>}
        </label>
        <input
          id="captcha-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onBlur={verifyCaptcha}
          className={`w-full px-6 py-4 bg-black/40 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-semibold ${verified ? 'border-green-500/50' : 'border-white/5'}`}
          required={required}
          disabled={loading}
          placeholder="Sync verification code"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
