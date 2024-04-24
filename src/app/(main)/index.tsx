'use client'

import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { IBoard } from '@/types'
import { Button } from '@nextui-org/react'
import { Clock, Star1 } from 'iconsax-react'
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
type TBoardsInfo = {
  boards: any
  recent: any
}

export const MainPage = () => {
  const [onFeching, setOnFeching] = useState<boolean>(false)
  const [boardsInfo, setBoardsInfo] = useState<TBoardsInfo>()
  const { userInfo } = useStoreUser()
  const handleGetMe = async () => {
    try {
      const payload = { email: userInfo?.email, fullName: userInfo?.name }
      const data: any = await instance.post('/v1/users', payload)
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
    setOnFeching(true)
  }, [userInfo])

  const listInfoBoards: TListInfoBoards[] = [
    {
      title: 'Starred boards',
      icon: <Star1 />,
      boards: boardsInfo?.recent,
    },
    {
      title: 'Recently viewed',
      icon: <Clock />,
      boards: boardsInfo?.boards,
    },
  ]

  return (
    <div className='bg-colorBoardContent text-white'>
      <div className='ct-container py-10 '>
        <div className='grid grid-cols-4'>
          <div className=''>123</div>
          <div className='col-span-3'>
            <div className='flex flex-col gap-10'>
              {listInfoBoards?.length > 0 ? (
                onFeching ? (
                  <>Loading...</>
                ) : (
                  listInfoBoards?.map((item) => {
                    if (!item.boards) return
                    return (
                      <div key={item.title} className='flex flex-col gap-4'>
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center gap-2'>
                            {item.icon}
                            <p>{item.title}</p>
                          </div>
                          <p>{item?.boards?.length}/3</p>
                        </div>
                        <div className='grid grid-cols-4 gap-2 '>
                          {item?.boards?.map((board) => (
                            <BoardItem key={item.title} board={board} />
                          ))}
                        </div>
                      </div>
                    )
                  })
                )
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
    <Link href={`/board/${board._id}`} className='group flex flex-col justify-between p-2 rounded-md bg-white/10 h-[100px] relative  overflow-hidden'>
      <p>{board.title}</p>
      <p>{board.description}</p>
      <Button
        as={'button'}
        disableRipple
        isDisabled={onSending}
        onClick={_handleToggleStar}
        className='p-0 bg-transparent absolute bottom-2 right-0 translate-x-[100%] duration-200 group-hover:-translate-x-2'
      >
        <Star1 variant={isStared ? 'Bold' : 'Outline'} className={isStared ? 'text-yellow-500' : 'text-white'} />
      </Button>
    </Link>
  )
}
