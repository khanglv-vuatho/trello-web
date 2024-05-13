import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { GoogleTagManager } from '@next/third-parties/google'
import Script from 'next/script'

const HeaderDynamic = dynamic(() => import('../../(layout)/Header'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'monetag',
  description: '7fa08e5f7f0fc2ab45ef26e4860af257',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <Head>
        <meta name='monetag' content='7fa08e5f7f0fc2ab45ef26e4860af257' />
      </Head>
      <GoogleTagManager gtmId='G-M7CBSRN0W9' />

      <Script async src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8862200387332284'></Script>
      <body>
        <Providers>
          <HeaderDynamic />
          <>{children}</>
        </Providers>
      </body>
    </html>
  )
}
