'use client'

import PopoverCustom from '@/components/PopoverCustom'
import { OverViewItem, WrapperItem } from '@/components/OverViewItem'
import { Button } from '@nextui-org/react'
import { ArrowDown2, Star1 } from 'iconsax-react'
import Image from 'next/image'
import React from 'react'

const Workspaces = () => {
  return (
    <PopoverCustom
      placement='bottom-start'
      popoverTrigger={
        <Button endContent={<ArrowDown2 size={16} />} variant='light' className='flex !min-h-10 flex-shrink-0 bg-transparent text-white hover:bg-white/10'>
          Workspaces
        </Button>
      }
    >
      <div className='flex max-h-[300px] w-[300px] flex-col items-center gap-2 overflow-y-auto overflow-x-hidden py-2'>
        {Array.from({ length: 10 }).map((_, index) => (
          <OverViewItem href={`/workspaces/${index + 1}`} key={index}>
            Workspace {index + 1}
          </OverViewItem>
        ))}
      </div>
    </PopoverCustom>
  )
}

export default Workspaces
