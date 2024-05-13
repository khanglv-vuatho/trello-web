import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import dynamic from 'next/dynamic'
import Head from 'next/head'
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
      <Head>
        <meta name='monetag' content='7fa08e5f7f0fc2ab45ef26e4860af257' />
      </Head>
      <GoogleTagManager gtmId='G-M7CBSRN0W9' />
      <body>
        <Providers>
          <HeaderDynamic />
          <>{children}</>
        </Providers>
      </body>
    </html>
  )
}
