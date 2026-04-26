import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="bg-slate-950 border-t border-white/5 py-24 mt-24">
      <div className="container mx-auto px-4 md:px-12 lg:px-16 flex flex-col items-center text-center gap-12">
        <div className="max-w-xl">
           <h3 className="text-white text-3xl font-black mb-4 uppercase tracking-tighter">Our platform is trusted by millions & features best updated movies all around the world.</h3>
           <div className="flex items-center justify-center gap-6 mt-12">
              <Link href="/" className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Home</Link>
              <Link href="/movies" className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Discovery</Link>
              <Link href="/tv" className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Influence</Link>
              <Link href="/" className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Release</Link>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
           </div>
           <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M18,7A1,1 0 0,0 17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7Z"/></svg>
           </div>
           <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22,5.8V18.2A3.8,3.8 0 0,1 18.2,22H5.8A3.8,3.8 0 0,1 2,18.2V5.8A3.8,3.8 0 0,1 5.8,2H18.2A3.8,3.8 0 0,1 22,5.8M14,18V13.5H15.5L15.8,11.7H14V10.5C14,10 14.1,9.7 14.8,9.7H15.8V8.1C15.6,8.1 15,8 14.3,8C12.9,8 12,8.8 12,10.3V11.7H10.4V13.5H12V18H14Z"/></svg>
           </div>
        </div>
        
        <div className="flex items-center justify-between w-full border-t border-white/5 pt-12 text-[10px] text-gray-700 uppercase font-black tracking-widest">
           <p>&copy; 2024 Orama Streaming. All Rights Reserved.</p>
           <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact</span>
           </div>
        </div>
      </div>
    </div>
  );
}
