'use client'

import { OverViewItem } from '@/components/OverViewItem'
import PopoverCustom from '@/components/PopoverCustom'
import { useStoreBoard } from '@/store'
import { IBoard } from '@/types'
import { Button } from '@nextui-org/react'
import { ArrowDown2 } from 'iconsax-react'

const Starred = () => {
  const { board } = useStoreBoard()
  const starredBoards = (board as any)?.boards?.filter((item: IBoard) => item?.isStared)
  return (
    <PopoverCustom
      placement='bottom-start'
      popoverTrigger={
        <Button endContent={<ArrowDown2 size={16} />} variant='light' className='flex !min-h-10 flex-shrink-0 bg-transparent text-white hover:bg-white/10'>
          Starred
        </Button>
      }
    >
      <div className='flex max-h-[300px] w-[300px] flex-col items-center gap-2 overflow-y-auto overflow-x-hidden py-2'>
        {starredBoards?.map((item: IBoard, index: number) => (
          <OverViewItem href={`/board/${item?._id}`} key={index} isStared={item?.isStared}>
            {item?.title}
          </OverViewItem>
        ))}
      </div>
    </PopoverCustom>
  )
}

export default Starred
