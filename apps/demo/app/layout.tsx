import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenLovable Demo',
  description: 'Demo app using OpenLovable core via adapter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-slate-900 antialiased">
        <main className="container mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
