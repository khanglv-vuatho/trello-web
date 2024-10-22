'use client'

import Drawer from '@/components/Drawer'
import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { Button, Skeleton } from '@nextui-org/react'
import { Clock, MoreCircle, Star1 } from 'iconsax-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Boards = {
  _id: string
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
  const [onFeching, setOnFeching] = useState<boolean>(false)
  const [boardsInfo, setBoardsInfo] = useState<Boards[]>([])
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false)
  const { userInfo } = useStoreUser()

  const handleGetMe = async () => {
    try {
      const data: any = await instance.get(`/v1/boards/get-all?email=${userInfo?.email}`)
      setBoardsInfo(data)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFeching(false)
    }
  }

  useEffect(() => {
    onFeching && !!userInfo && handleGetMe()
  }, [onFeching, userInfo])

  useEffect(() => {
    if (userInfo === undefined) return
    setOnFeching(true)
  }, [userInfo])

  const listInfoBoards: TListInfoBoards[] = [
    {
      title: 'Starred boards',
      icon: <Star1 />,
      boards: boardsInfo.filter((item) => item.isStared),
    },
    {
      title: 'Recently viewed',
      icon: <Clock />,
      boards: boardsInfo.filter((item) => !item.isStared),
    },
  ]

  const handleToggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer)
  }

  return (
    <div className='bg-colorBoardContent text-white'>
      <Drawer isOpen={isOpenDrawer} onClose={handleToggleDrawer}>
        <div className='p-4'>123</div>
      </Drawer>
      <div className='ct-container py-10 h-boardContainer'>
        <div className='grid grid-cols-4'>
          <Button>Boards</Button>
          <div onClick={handleToggleDrawer}>123</div>
          <div className='col-span-3'>
            <div className='flex flex-col gap-10'>
              {listInfoBoards?.length > 0 ? (
                listInfoBoards?.map((item) => {
                  if (!item.boards) return
                  return (
                    <div key={item.title} className='flex flex-col gap-4'>
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                          {item.icon}
                          <p>{item.title}</p>
                        </div>
                        <p>{item?.boards?.length}</p>
                      </div>
                      {onFeching ? (
                        <Skeleton className='w-[200px] before:border-0 before:via-white/20 h-[100px] rounded-[4px] bg-white/10' />
                      ) : (
                        <div className='flex gap-2 w-full overflow-auto pb-2'>
                          {item?.boards?.map((board) => (
                            <BoardItem key={item.title} board={board} />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BoardItem = ({ board }: { board: Boards }) => {
  const [isStared, setIsStared] = useState<boolean>(board.isStared)
  const [onSending, setOnSending] = useState<boolean>(false)
  const _handleToggleStar = (e: any) => {
    e.preventDefault()
    setOnSending(true)
    setIsStared(!isStared)
  }
  const handleToggleStartApi = async () => {
    try {
      await instance.put('/v1/boards/' + board._id, { isStared: !isStared })
    } catch (error) {
      console.log(error)
    } finally {
      setOnSending(false)
    }
  }
  useEffect(() => {
    onSending && handleToggleStartApi()
  }, [onSending])

  return (
    <Link href={`/board/${board._id}`} className='min-w-[200px] group flex flex-col justify-between p-2 rounded-md bg-white/10 h-[100px] relative overflow-hidden'>
      <p className='line-clamp-1 max-w-[140px]'>{board.title}</p>
      <p className='line-clamp-1 max-w-[140px]'>{board.description}</p>
      <Button
        as={'button'}
        disableRipple
        isDisabled={onSending}
        onClick={_handleToggleStar}
        className='p-0 bg-transparent absolute top-2 right-0 translate-x-[100%] duration-200 group-hover:translate-x-[10px]'
      >
        {/* dots icon */}
        <MoreCircle variant={isStared ? 'Bold' : 'Outline'} className={isStared ? 'text-yellow-500' : 'text-white'} />
      </Button>
      <Button
        as={'button'}
        disableRipple
        isDisabled={onSending}
        onClick={_handleToggleStar}
        className='p-0 bg-transparent absolute bottom-2 right-0 translate-x-[100%] duration-200 group-hover:translate-x-[10px]'
      >
        <Star1 variant={isStared ? 'Bold' : 'Outline'} className={isStared ? 'text-yellow-500' : 'text-white'} />
      </Button>
    </Link>
  )
}
