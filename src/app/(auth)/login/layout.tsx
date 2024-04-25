import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login to Trello vika',
  description: 'Login to Trello vika',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
