import type { Metadata } from 'next'

export async function generateMetadata({ searchParams, params }: { searchParams: any; params: any }): Promise<Metadata> {
  return {
    title: `Board details`,
    description: `Board details`,
  }
}

export default function BoardDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}
