import { GoogleOAuthProvider } from '@react-oauth/google'
import type { Metadata } from 'next'

import './auth.css'
export const metadata: Metadata = {
  title: 'Login to Trello vika',
  description: 'Login to Trello vika',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>{children}</GoogleOAuthProvider>
      </body>
    </html>
  )
}
