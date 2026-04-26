"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await login(identifier, password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid username/email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />
      
      {/* Professional Purple Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 blur-[150px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 pt-32 md:pt-48 flex items-center justify-center p-4 pb-32">
        <div className="w-full max-w-md">
          <div className="glass-card shadow-3xl p-10 md:p-14 relative group">
            {/* Professional Accent Glow */}
            <div className="premium-glow"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 mb-2 block">Network Authentication</span>
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white">Sign In</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="identifier" className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-5">
                    User Identity
                  </label>
                  <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="input w-full"
                    required
                    placeholder="Username or Channel Email"
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-5">
                    Security Key
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full"
                    required
                    placeholder="Enter secret sequence"
                    autoComplete="current-password"
                  />
                </div>

                <div className="flex items-center justify-end px-2">
                  <Link href="/reset-password" translate="no" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-500 transition-colors">
                    Reset Logic?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full py-5 text-[10px] uppercase tracking-[0.3em] active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Processing Sync...' : 'Initiate Session'}
                </button>

                <div className="text-center mt-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    New to the Orama Network?{' '}
                    <Link href="/signup" className="text-primary-500 hover:text-primary-400 underline underline-offset-4 transition-all">
                      Register Node
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

import Link from 'next/link';
