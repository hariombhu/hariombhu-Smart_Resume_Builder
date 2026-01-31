import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Resume Planner - AI-Assisted Smart Resume Builder',
    description: 'Create professional, ATS-friendly resumes with AI assistance. Perfect for students and job seekers.',
    keywords: 'resume builder, cv maker, job application, career, ai resume, ats friendly',
    authors: [{ name: 'Resume Planner Team' }],
    manifest: '/manifest.json',
    themeColor: '#3b82f6',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/icon-192x192.png" />
            </head>
            <body className={inter.className}>
                <ThemeProvider>
                    <AuthProvider>
                        {children}
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: 'var(--background)',
                                    color: 'var(--foreground)',
                                    border: '1px solid var(--glass-border)',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10b981',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
