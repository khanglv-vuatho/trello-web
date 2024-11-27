import React, { FC } from 'react'
import WrapperItem from './WrapperItem'
import Image from 'next/image'
import { Button, cn } from '@nextui-org/react'
import { Star1 } from 'iconsax-react'

type OverViewItemProps = {
  href: string
  children: React.ReactNode
  className?: string
}
const OverViewItem = ({ href, children, className }: OverViewItemProps) => {
  return (
    <WrapperItem href={href} className={cn('group justify-between', className)}>
      <div className='flex items-center gap-2'>
        <div className='size-10 rounded-lg bg-red-200'>
          <Image src={'/'} alt='workspace' height={100} width={100} className='size-full object-cover' />
        </div>
        <p className='text-sm font-medium text-white'>{children}</p>
      </div>
      <Button
        onClick={(e) => e.preventDefault()}
        isIconOnly
        className='!min-h-8 !min-w-8 flex-shrink-0 translate-x-10 bg-transparent text-white duration-150 hover:text-yellow-300 group-hover:flex group-hover:translate-x-0'
      >
        <Star1 variant='Bold' />
      </Button>
    </WrapperItem>
  )
}

export default OverViewItem
