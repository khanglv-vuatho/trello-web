import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import dynamic from 'next/dynamic'
import { GoogleTagManager } from '@next/third-parties/google'
import Head from 'next/head'
import AdSense from '@/AdsSense'

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
      <GoogleTagManager gtmId='G-M7CBSRN0W9' />
      <Head>
        <AdSense pId={process.env.NEXT_PUBLIC_ADSENSE?.toString() || ''} />
      </Head>
      <body>
        <Providers>
          <HeaderDynamic />
          <>{children}</>
        </Providers>
      </body>
    </html>
  )
}
