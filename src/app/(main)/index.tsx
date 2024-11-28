'use client'

import BoardItem from '@/components/BoardItem'
import { useStoreBoard, useStoreUser, useStoreWorkspace } from '@/store'
import { IBoard, TBoards } from '@/types'
import { Skeleton } from '@nextui-org/react'
import { Clock, Folder, Star1 } from 'iconsax-react'
import { useEffect, useState } from 'react'

type TListInfoBoards = {
  title: string
  icon: JSX.Element
  boards: TBoards[]
}

export const MainPage = () => {
  const [onFeching, setOnFeching] = useState<boolean>(false)
  const { userInfo } = useStoreUser()
  const { fetchAllBoards, storeBoardRecent, storeBoardStar, boardsRecent, boardsStar } = useStoreBoard()
  const { storeWorkspace, workspace } = useStoreWorkspace()

  const handleGetMe = async () => {
    if (!userInfo) return
    try {
      const data: any = await fetchAllBoards(userInfo.email)
      storeWorkspace(data?.workspace)
      storeBoardRecent(data?.boards?.filter((item: IBoard) => !item?.isStared))
      storeBoardStar(data?.boards?.filter((item: IBoard) => item?.isStared))
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
      boards: boardsStar || [],
    },
    {
      title: 'Recently viewed',
      icon: <Clock />,
      boards: boardsRecent || [],
    },
    {
      title: 'Workspace',
      icon: <Folder />,
      boards: workspace || [],
    },
  ]

  return (
    <div className='bg-colorBoardContent text-white'>
      <div className='ct-container h-boardContainer py-10'>
        <div className='grid grid-cols-4'>
          <div className='col-span-3'>
            <div className='flex flex-col gap-10'>
              {listInfoBoards?.length > 0 ? (
                listInfoBoards?.map((item) => {
                  if (!item.boards) return
                  return (
                    <div key={item.title} className='flex flex-col gap-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          {item.icon}
                          <p>{item.title}</p>
                        </div>
                        <p>{item?.boards?.length}</p>
                      </div>
                      {onFeching ? (
                        <div className='flex min-h-[100px] w-full gap-2 overflow-auto pb-2'>
                          {Array(3)
                            .fill(0)
                            .map((_, index) => (
                              <Skeleton key={index} className='h-[100px] min-w-[200px] rounded-[4px] bg-white/10 before:border-0 before:via-white/20' />
                            ))}
                        </div>
                      ) : (
                        <div className='flex min-h-[100px] w-full gap-2 overflow-auto pb-2'>{item?.boards?.map((board) => <BoardItem key={item.title} board={board} />)}</div>
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
