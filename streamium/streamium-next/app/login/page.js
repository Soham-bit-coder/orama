import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />
      <div className="pt-48 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Authentication Unavailable</h1>
        <p className="text-gray-500 mb-8">User accounts are currently disabled.</p>
        <Link href="/" className="px-8 py-3 bg-primary-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary-500 transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
