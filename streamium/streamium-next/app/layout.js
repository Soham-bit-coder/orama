import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { ProviderProvider } from '@/context/ProviderContext';
import SplashScreen from '@/components/SplashScreen';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Orama Streaming - Professional Cinematic Experience',
  description: 'Orama Streaming is a next-generation platform featuring the best movies and TV shows from around the world.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SplashScreen />
        <AuthProvider>
          <ToastProvider>
            <WatchlistProvider>
              <ProviderProvider>
                {children}
              </ProviderProvider>
            </WatchlistProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
