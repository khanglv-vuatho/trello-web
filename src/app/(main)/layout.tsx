import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import { GoogleTagManager } from '@next/third-parties/google'
import Header from '@/(layout)/Header'

export const metadata: Metadata = {
  title: 'NTTU Workspace',
  description: 'NTTU Workspace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <GoogleTagManager gtmId='G-06FGH3XJJZ' />
      <body>
        <Providers>
          <Header />
          <>{children}</>
        </Providers>
      </body>
    </html>
  )
}
