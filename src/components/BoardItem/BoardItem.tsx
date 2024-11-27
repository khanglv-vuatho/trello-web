'use client'

import { useStoreBoard } from '@/store'
import { TBoards } from '@/types'
import React, { useEffect, useState } from 'react'
import Toast from '../Toast'
import Modal from '../Modal'
import { Button, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import Link from 'next/link'
import { MoreCircle, Star1 } from 'iconsax-react'

const BoardItem = ({ board, setBoardsInfo, boardsInfo }: { board: TBoards; setBoardsInfo: (boards: TBoards[]) => void; boardsInfo: TBoards[] }) => {
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

export default BoardItem
