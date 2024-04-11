'use client'

import { Button } from '@nextui-org/react'
import { Clock, Star1 } from 'iconsax-react'
import React, { useState } from 'react'

type Boards = {
  title: string
  description: string
  isStared: boolean
}
type TListInfoBoards = {
  title: string
  icon: JSX.Element
  boards: Boards[]
}
export const MainPage = () => {
  const listInfoBoards: TListInfoBoards[] = [
    {
      title: 'Starred boards',
      icon: <Star1 />,
      boards: [
        { title: 'khang', description: 'khang', isStared: false },
        { title: 'khang123', description: 'khang', isStared: false },
      ],
    },
    {
      title: 'Recently viewed',
      icon: <Clock />,
      boards: [
        { title: 'khang dep trai', description: 'khang', isStared: false },
        { title: 'khang hihi', description: 'khang', isStared: false },
      ],
    },
  ]

  return (
    <div className='bg-colorBoardContent text-white'>
      <div className='ct-container py-10 '>
        <div className='grid grid-cols-4'>
          <div className=''>123</div>
          <div className='col-span-3'>
            <div className='flex flex-col gap-10'>
              {listInfoBoards.map((item) => (
                <div key={item.title} className='flex flex-col gap-4'>
                  <div className='flex items-center gap-2'>
                    {item.icon}
                    <p>{item.title}</p>
                  </div>
                  <div className='grid grid-cols-4 gap-2 '>
                    {item.boards.map((board) => (
                      <BoardItem key={item.title} board={board} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BoardItem = ({ board }: { board: Boards }) => {
  const [isStared, setIsStared] = useState<boolean>(board.isStared)

  const _handleToggleStar = () => {
    setIsStared(!isStared)
  }
  return (
    <div className='flex flex-col justify-between p-2 rounded-md bg-red-200 h-[100px] relative group overflow-hidden'>
      <p>{board.title}</p>
      <p>{board.description}</p>
      <Button onPress={() => _handleToggleStar()} disableRipple isIconOnly className='p-0 bg-transparent absolute bottom-2 right-0 translate-x-[100%] duration-200 group-hover:-translate-x-2'>
        <Star1 variant={isStared ? 'Bold' : 'Outline'} className={isStared ? 'text-yellow-500' : 'text-white'} />
      </Button>
    </div>
  )
}
