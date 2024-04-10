import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/(layout)/Header'

export const metadata: Metadata = {
  title: 'Trello vika',
  description: 'Trello web clone by vika',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className=''>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
