import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nearby Vibes - Discover Local Specials',
  description: 'Find time-limited drink and food specials at nearby venues',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nearby Vibes',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#7F53F3" />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  background: '#faf8f6',
                  surface: '#FFFFFF',
                  text: {
                    primary: '#0A0A0A',
                    secondary: 'rgba(10,10,10,0.65)',
                    tertiary: 'rgba(10,10,10,0.5)',
                  },
                  accent: {
                    primary: '#7F53F3',
                    hover: '#95048B',
                    bright: '#F814E8',
                    success: '#25EFB8',
                    success_dark: '#0A9B71',
                  },
                  border: {
                    light: 'rgba(10,10,10,0.08)',
                    default: 'rgba(10,10,10,0.06)',
                  },
                },
                borderRadius: {
                  full: '999px',
                  lg: '22px',
                  md: '14px',
                  sm: '10px',
                  xs: '8px',
                }
              }
            }
          }
        </script>
      </head>
      <body className="h-full overflow-hidden bg-background">
        <div className="flex flex-col h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
