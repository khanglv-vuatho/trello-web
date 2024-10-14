import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import dynamic from 'next/dynamic'
import { GoogleTagManager } from '@next/third-parties/google'

const HeaderDynamic = dynamic(() => import('../../(layout)/Header'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Trello vika',
  description: 'Trello web clone by vika',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <GoogleTagManager gtmId='G-06FGH3XJJZ' />
      <body>
        <Providers>
          <HeaderDynamic />
          <>{children}</>
        </Providers>
      </body>
    </html>
  )
}
