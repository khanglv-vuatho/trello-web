import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import dynamic from 'next/dynamic'

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
      <body>
        <Providers>
          <HeaderDynamic />
          <>{children}</>
        </Providers>
      </body>
    </html>
  )
}
