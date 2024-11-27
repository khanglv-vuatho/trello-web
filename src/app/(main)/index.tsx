'use client'

import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import { useStoreBoard, useStoreUser } from '@/store'
import { Button, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger, Skeleton } from '@nextui-org/react'
import { Clock, MoreCircle, Star1 } from 'iconsax-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
  const { userInfo } = useStoreUser()
  const { fetchAllBoards } = useStoreBoard()

  const handleGetMe = async () => {
    if (!userInfo) return
    try {
      const data: any = await fetchAllBoards(userInfo.email)
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
      boards: boardsInfo?.filter((item) => item?.isStared),
    },
    {
      title: 'Recently viewed',
      icon: <Clock />,
      boards: boardsInfo?.filter((item) => !item?.isStared),
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
                        <Skeleton className='h-[100px] w-[200px] rounded-[4px] bg-white/10 before:border-0 before:via-white/20' />
                      ) : (
                        <div className='flex min-h-[100px] w-full gap-2 overflow-auto pb-2'>
                          {item?.boards?.map((board) => <BoardItem key={item.title} board={board} setBoardsInfo={setBoardsInfo} boardsInfo={boardsInfo} />)}
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

const BoardItem = ({ board, setBoardsInfo, boardsInfo }: { board: Boards; setBoardsInfo: (boards: Boards[]) => void; boardsInfo: Boards[] }) => {
  const [isStared, setIsStared] = useState<boolean>(board?.isStared)
  const [onSending, setOnSending] = useState<boolean>(false)
  const [isOpenPopover, setIsOpenPopover] = useState<boolean>(false)
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false)
  const [onDeleting, setOnDeleting] = useState<boolean>(false)
  const { starBoard, deleteBoard } = useStoreBoard()

  const _handleToggleStar = (e: any) => {
    e.preventDefault()
    setOnSending(true)
    setIsStared(!isStared)
  }

  const handleToggleStartApi = async () => {
    try {
      await starBoard(board?._id, isStared)
      setBoardsInfo(boardsInfo?.map((item) => (item._id === board?._id ? { ...item, isStared } : item)))
    } catch (error) {
      console.log(error)
    } finally {
      setOnSending(false)
    }
  }

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard(board?._id)
      setBoardsInfo(boardsInfo?.filter((item) => item._id !== board?._id))
      Toast({ message: 'Board deleted successfully', type: 'success' })
    } catch (error) {
      console.log(error)
    } finally {
      setOnDeleting(false)
      setIsOpenModalDelete(false)
    }
  }

  const handleOpenModalDelete = () => {
    setIsOpenPopover(false)
    setIsOpenModalDelete(true)
  }

  useEffect(() => {
    onSending && handleToggleStartApi()
  }, [onSending])

  useEffect(() => {
    onDeleting && handleDeleteBoard()
  }, [onDeleting])

  return (
    <div className='group relative flex h-[100px] min-w-[200px] flex-col justify-between overflow-hidden rounded-md bg-white/10 p-2'>
      <Modal isOpen={isOpenModalDelete} onOpenChange={setIsOpenModalDelete} modalTitle='Delete board'>
        <p>Are you sure you want to delete this board?</p>
        <div className='flex justify-between gap-2'>
          <Button isLoading={onDeleting} onPress={() => setOnDeleting(true)} variant='light' color='danger' className='w-full px-4 py-2'>
            Delete
          </Button>
          <Button onPress={() => setIsOpenModalDelete(false)} className='w-full px-4 py-2' variant='bordered'>
            Cancel
          </Button>
        </div>
      </Modal>
      <Link href={`/board/${board?._id}`} className='absolute inset-0 z-10'>
        <span className='sr-only'>Go to board: {board?.title}</span>
      </Link>
      <p className='line-clamp-1 max-w-[140px]'>{board?.title}</p>
      <p className='line-clamp-1 max-w-[140px]'>{board?.description}</p>

      <Popover
        classNames={{
          content: 'p-0.5',
        }}
        placement='right'
        className='z-20'
        isOpen={isOpenPopover}
        onOpenChange={setIsOpenPopover}
      >
        <PopoverTrigger>
          <Button disableRipple className='absolute right-0 top-2 translate-x-[100%] bg-transparent p-0 duration-200 group-hover:translate-x-[10px]' onClick={(e) => e.preventDefault()}>
            {/* dots icon */}
            <MoreCircle className='text-white' />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Listbox aria-label='Actions'>
            <ListboxItem key='delete' className='text-danger' color='danger' onClick={handleOpenModalDelete}>
              Delete board
            </ListboxItem>
          </Listbox>
        </PopoverContent>
      </Popover>
      <Button
        as={'button'}
        disableRipple
        isDisabled={onSending}
        onClick={_handleToggleStar}
        className='absolute bottom-2 right-0 z-[200] translate-x-[100%] bg-transparent p-0 duration-200 group-hover:translate-x-[10px]'
      >
        <Star1 variant={isStared ? 'Bold' : 'Outline'} className={isStared ? 'text-yellow-500' : 'text-white'} />
      </Button>
    </div>
  )
}
