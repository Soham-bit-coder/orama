"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv', label: 'TV Shows' },
    { href: '/watchlist', label: 'Watchlist', requiresAuth: true }
  ];

  async function handleLogout() {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-700 ${isScrolled || isMobileMenuOpen ? 'bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 py-2 md:py-3' : 'bg-gradient-to-b from-slate-950/95 via-slate-950/40 to-transparent py-4 md:py-5'}`}
    >
      <div className="container flex items-center justify-between h-12 md:h-14">
        {/* Professional Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 active:scale-95 transition-transform shrink-0 group" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="relative w-9 h-9 shrink-0">
             <div className="absolute inset-0 bg-primary-600 rounded-xl rotate-6 blur-md opacity-20 group-hover:rotate-12 group-hover:opacity-40 transition-all duration-700"></div>
             <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-primary-400 via-primary-600 to-indigo-700 flex items-center justify-center shadow-2xl border border-white/10 transition-colors">
               <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M8 5v14l11-7z"/>
               </svg>
             </div>
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-xl font-black uppercase tracking-tighter text-white leading-none">
              Orama
            </span>
            <span className="text-[8px] font-black text-primary-500 uppercase tracking-[0.4em] leading-none mt-0.5">
              Streaming
            </span>
          </div>
        </Link>

        {/* Professional Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10 xl:gap-12">
          {navItems.map((item) => (
            (!item.requiresAuth || isAuthenticated) && (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-xs font-black uppercase tracking-[0.2em] transition-all group ${pathname === item.href ? 'text-primary-500' : 'text-gray-400 hover:text-white'}`}
              >
                {item.label}
                <div className={`absolute -bottom-2 left-0 right-0 h-[2px] bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full ${pathname === item.href ? 'scale-x-100' : ''}`}></div>
              </Link>
            )
          ))}
        </div>

        {/* Professional Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link
            href="/search"
            className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl shadow-sm transition-all border border-transparent hover:border-white/5 group"
            aria-label="Search"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-3 pl-3 pr-2 py-2 bg-white/3 border border-white/5 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-all font-bold text-sm shadow-xl"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-[10px] uppercase font-black text-white shadow-lg shadow-primary-500/10">
                   {user?.username?.charAt(0)}
                </div>
                <span className="max-w-[120px] truncate text-xs font-black uppercase tracking-widest">{user?.username}</span>
                <svg className={`w-4 h-4 transition-transform duration-500 text-gray-500 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-4 w-60 bg-slate-900/95 border border-white/10 rounded-[28px] shadow-3xl backdrop-blur-3xl overflow-hidden py-3 animate-in fade-in slide-in-from-top-6 duration-500">
                  <div className="px-6 py-3 border-b border-white/5 mb-2">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Network ID</p>
                     <p className="text-sm font-black text-white truncate">{user?.email}</p>
                  </div>
                  {user?.isAdmin && (
                    <Link
                      href="/admin/moderation"
                      className="flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Admin Node</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    className="w-full flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                    onClick={handleLogout}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/login"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all transform hover:scale-105"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3.5 bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-primary-500 shadow-2xl shadow-primary-600/20 active:scale-95 transition-all border border-primary-400/20"
              >
                Join Network
              </Link>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button
            type="button"
            className="lg:hidden w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white transition-all transform active:scale-90"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="relative w-7 h-5 flex flex-col justify-between">
               <div className={`h-1 w-full bg-current rounded-full transition-all duration-500 origin-left ${isMobileMenuOpen ? 'rotate-45 translate-x-1' : ''}`}></div>
               <div className={`h-1 w-full bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-60'}`}></div>
               <div className={`h-1 w-full bg-current rounded-full transition-all duration-500 origin-left ${isMobileMenuOpen ? '-rotate-45 translate-x-1' : 'opacity-40'}`}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Professional Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 pt-24 bg-slate-950/98 backdrop-blur-3xl z-[90] overflow-y-auto duration-700 animate-in fade-in zoom-in-95">
          <div className="container py-12 flex flex-col gap-12 min-h-full">
            <div className="flex flex-col gap-10">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-500/50 mb-2">Network Navigation</p>
               {navItems.map((item) => (
                  (!item.requiresAuth || isAuthenticated) && (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-6xl font-black uppercase tracking-tighter transition-all transform hover:translate-x-4 ${pathname === item.href ? 'text-primary-500' : 'text-white'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
               ))}
            </div>

            <div className="mt-auto border-t border-white/5 pt-12 pb-24 flex flex-col gap-6">
              {!isAuthenticated ? (
                <>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Member Status: Unknown</p>
                   <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-6 bg-white/5 rounded-[32px] text-center font-black uppercase text-[10px] tracking-widest border border-white/5 shadow-xl">Initiate Sync</Link>
                      <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-6 bg-primary-600 rounded-[32px] text-center font-black uppercase text-[10px] tracking-widest text-white shadow-2xl shadow-primary-600/30">Join Network</Link>
                   </div>
                </>
              ) : (
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="w-full px-8 py-6 bg-red-600/10 text-red-500 rounded-[32px] text-center font-black uppercase text-[10px] tracking-widest border border-red-500/10 hover:bg-red-600/20 transition-all font-bold"
                >
                  Terminate Interface Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
