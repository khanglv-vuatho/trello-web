import { Avatar, Button, cn } from '@nextui-org/react'
import { Star1 } from 'iconsax-react'
import React from 'react'
import WrapperItem from './WrapperItem'

type OverViewItemProps = {
  href: string
  children: React.ReactNode
  className?: string
  isStared?: boolean
  hiddenStar?: boolean
}

const OverViewItem = ({ href, children, className, isStared, hiddenStar }: OverViewItemProps) => {
  return (
    <WrapperItem href={href} className={cn('group justify-between', className)}>
      <div className='flex items-center gap-2'>
        <div className='size-10'>
          <Avatar alt='workspace' radius='sm' name={(children as string)?.charAt?.(0)} className='size-full object-cover text-lg' />
        </div>
        <p className='text-sm font-medium text-white'>{children}</p>
      </div>
      <Button
        onClick={(e) => e.preventDefault()}
        isIconOnly
        className='!min-h-8 !min-w-8 flex-shrink-0 translate-x-10 bg-transparent text-white duration-150 hover:text-yellow-300 group-hover:flex group-hover:translate-x-0'
      >
        {!hiddenStar && <Star1 variant={isStared ? 'Bold' : 'Outline'} className={isStared ? 'text-yellow-300' : ''} />}
      </Button>
    </WrapperItem>
  )
}

export default OverViewItem
