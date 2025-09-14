import './globals.css'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata = {
  title: 'CampusQ',
  description: 'Efficient queue management for campus services',
  openGraph: {
    title: 'CampusQ - Smart Campus Queue Management',
    description: 'Transform your campus experience with intelligent queue management. No more waiting in lines.',
    url: 'https://campusq.vercel.app',
    siteName: 'CampusQ',
    images: [
      {
        url: 'https://campusq.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CampusQ - Smart Campus Queue Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampusQ - Smart Campus Queue Management',
    description: 'Transform your campus experience with intelligent queue management. No more waiting in lines.',
    images: ['https://campusq.vercel.app/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${montserrat.className} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
        {children}
        <div id="security-monitor" style={{ display: 'none' }} />
      </body>
    </html>
  )
}