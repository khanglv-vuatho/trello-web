import { cn } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

const WrapperItem = ({ children, className, href }: { children: React.ReactNode; className?: string; href?: string }) => {
  return href ? (
    <Link
      href={href}
      className={cn('flex w-full items-center gap-2 rounded-lg border border-white/20 bg-white/5 p-2 transition-colors hover:bg-white/10', className)}
      style={{ opacity: 1, willChange: 'opacity, transform', transform: 'none' }}
    >
      {children}
    </Link>
  ) : (
    <div
      className={cn('flex w-full items-center gap-2 rounded-lg border border-white/20 bg-white/5 p-2 transition-colors hover:bg-white/10', className)}
      style={{ opacity: 1, willChange: 'opacity, transform', transform: 'none' }}
    >
      {children}
    </div>
  )
}

export default WrapperItem