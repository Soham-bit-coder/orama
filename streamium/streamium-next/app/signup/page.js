"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Captcha from '@/components/Captcha';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaId, setCaptchaId] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const validatePassword = (pass) => {
    if (pass.length < 8) return 'Security key too short (8 chars min)';
    if (!/[A-Z]/.test(pass)) return 'Add one uppercase character';
    if (!/[a-z]/.test(pass)) return 'Add one lowercase character';
    if (!/[0-9]/.test(pass)) return 'Add one numeric digit';
    return null;
  };

  const handleCaptchaVerify = (detail) => {
    setCaptchaVerified(detail.valid);
    if (detail.valid) {
      setCaptchaId(detail.captchaId);
      setCaptchaAnswer(detail.answer);
      setError('');
    } else {
      setError('Neural scan failed. Human verification required.');
      setCaptchaId('');
      setCaptchaAnswer('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('All data sectors must be populated');
      return;
    }

    if (username.length < 3) {
      setError('Identity handle too short (3 chars min)');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Security sequences do not match');
      return;
    }

    if (!captchaVerified) {
      setError('Please finalize neural verification');
      return;
    }

    setLoading(true);

    try {
      const success = await register(
        username,
        email,
        password
      );
      if (success) {
        router.push('/');
      } else {
        setError('Registration failed. ID or Channel might be active.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('A critical error occurred during sync.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />

      {/* Professional Purple Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[-5%] w-[60%] h-[60%] bg-primary-600/10 blur-[180px] rounded-full animate-float"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[60%] h-[60%] bg-indigo-600/10 blur-[180px] rounded-full animate-float" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="relative z-10 pt-32 md:pt-48 flex items-center justify-center p-4 pb-40">
        <div className="w-full max-w-2xl">
          <div className="glass-card shadow-3xl p-10 md:p-14 relative group">
             {/* Professional Accent Glow */}
             <div className="premium-glow"></div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-500 mb-2 block">Network Integration</span>
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white">Create Node</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center animate-shake">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label htmlFor="username" className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-5">
                        Username / Alias <span className="text-primary-500">*</span>
                     </label>
                     <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input w-full"
                        required
                        minLength={3}
                        placeholder="Choose a screen name"
                     />
                  </div>

                  <div className="space-y-2">
                     <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-5">
                        Email Address <span className="text-primary-500">*</span>
                     </label>
                     <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input w-full"
                        placeholder="Enter your email"
                        required
                     />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-5">
                        Secret Password <span className="text-primary-500">*</span>
                     </label>
                     <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input w-full"
                        required
                        minLength={8}
                        placeholder="8+ complex characters"
                        autoComplete="new-password"
                     />
                  </div>

                  <div className="space-y-2">
                     <label htmlFor="confirm-password" className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-5">
                        Repeat Password <span className="text-primary-500">*</span>
                     </label>
                     <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input w-full"
                        required
                        placeholder="Type it again"
                        autoComplete="new-password"
                     />
                  </div>
                </div>

                <div className="p-8 bg-slate-950/40 rounded-[32px] border border-white/5 shadow-inner">
                   <Captcha onVerify={handleCaptchaVerify} />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full py-5 text-[10px] uppercase tracking-[0.4em] active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Finalizing Sync...' : 'Initialize Integration'}
                </button>

                <div className="text-center mt-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Already a member of the Orama Network?{' '}
                    <Link href="/login" className="text-primary-500 hover:text-primary-400 underline underline-offset-4 transition-all">
                      Reconnect Interface
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
