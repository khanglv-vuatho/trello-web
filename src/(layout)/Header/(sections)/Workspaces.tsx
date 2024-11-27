'use client'

import { OverViewItem } from '@/components/OverViewItem'
import PopoverCustom from '@/components/PopoverCustom'
import { useStoreWorkspace } from '@/store'
import { Button } from '@nextui-org/react'
import { ArrowDown2 } from 'iconsax-react'

const Workspaces = () => {
  const { workspace } = useStoreWorkspace()

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
        {workspace?.map((item, index) => (
          <OverViewItem href={`/board/${item?._id}`} key={index} hiddenStar>
            {item?.title}
          </OverViewItem>
        ))}
      </div>
    </PopoverCustom>
  )
}

export default Workspaces
