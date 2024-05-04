import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/(layout)/Header'

export const metadata: Metadata = {
  title: 'Trello vika',
  description: 'Trello web clone by vika',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>
          <Header />
          <>{children}</>
        </Providers>
      </body>
    </html>
  )
}
