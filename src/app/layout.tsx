
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/Header';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { PlanProvider } from '@/hooks/use-plan';

export const metadata: Metadata = {
  title: 'GymGenius',
  description: 'Your AI-powered personal trainer and nutritionist.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PlanProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Toaster />
          </PlanProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
