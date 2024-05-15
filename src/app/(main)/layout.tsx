import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import dynamic from 'next/dynamic'
import { GoogleTagManager } from '@next/third-parties/google'
import Head from 'next/head'
import AdSense from '@/AdsSense'
import Script from 'next/script'

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
      <script src='https://alwingulla.com/88/tag.min.js' data-zone='65681' async data-cfasync='false'></script>
      <script async data-cfasync='false' src='thubanoa.com/1?z=7480785'></script>
      <meta name='google-adsense-account' content='ca-pub-8862200387332284' />

      <meta name='monetag' content='bf1b32bb19ba22d925d491d8d77913fa' />
      <body>
        <Providers>
          <HeaderDynamic />
          <>{children}</>
        </Providers>
      </body>
    </html>
  )
}
