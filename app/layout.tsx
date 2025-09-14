import './globals.css'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata = {
  title: 'CampusQ',
  description: 'Efficient queue management for campus services',
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
        <meta property="og:image" content="https://campusq.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content="CampusQ - Smart Campus Queue Management" />
        <meta property="og:description" content="Transform your campus experience with intelligent queue management. No more waiting in lines." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://campusq.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://campusq.vercel.app/og-image.png" />
      </head>
      <body className={`${montserrat.className} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
        {children}
        <div id="security-monitor" style={{ display: 'none' }} />
      </body>
    </html>
  )
}