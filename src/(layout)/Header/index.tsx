'use client'

import { googleLogout } from '@react-oauth/google'
import React, { useEffect, useRef, useState } from 'react'

import { Avatar, Button, Input, useDisclosure } from '@nextui-org/react'
import { Add, Logout, SearchNormal1, User } from 'iconsax-react'

import ExpandButton from '@/components/ExpandButton'
import { LoadingSearch } from '@/components/Icons'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { deleteCookie, getCookie } from 'cookies-next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ContentUser, Messages, Notifications, Recent, Starred, Workspaces } from './(sections)'
import { InputSearch } from '@/components/InputSearch'

function Header() {
  const google_token = getCookie('google_token')
  const { storeUser } = useStoreUser()

  const router = useRouter()

  const [onSending, setOnSending] = useState<boolean>(false)
  const [onFetching, setOnFetching] = useState<boolean>(false)

  const userInfo = useStoreUser((state) => state.userInfo)
  const [titleBoard, setTitleBoard] = useState<string>('')
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleBoard(e.target.value)
  }

  const handleCreateNewBoard = async () => {
    try {
      const payload = { title: titleBoard, type: 'public', ownerId: userInfo?.email }
      const data: any = await instance.post('/v1/boards', payload)

      Toast({ message: 'Create Board Successful', type: 'success' })
      setTitleBoard('')
      router.push(`/board/${data?._id}`)
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setOnSending(false)
    }
  }

  const handleGetDetailUser = async ({ payload }: { payload: any }) => {
    try {
      const dataUser: any = await instance.post(`/v1/users/login`, payload)
      storeUser(dataUser.boards)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchingUser = async () => {
    try {
      const dataUser: any = await instance.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${google_token}`)
      await handleGetDetailUser({ payload: dataUser })
    } catch (error) {
      if (error) {
        deleteCookie('access_token')
        router.push('/login')
      }
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  const handleConfirmCreateNewBoard = () => {
    setOnSending(true)
  }

  useEffect(() => {
    setOnFetching(true)
  }, [])

  useEffect(() => {
    onFetching && handleFetchingUser()
  }, [onFetching])

  useEffect(() => {
    onSending && handleCreateNewBoard()
  }, [onSending])

  return (
    <header className='flex h-header items-center justify-between gap-5 overflow-x-auto bg-colorHeader px-4 text-primary'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Link href={'/'} className='flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-1 rounded-[3px] px-2 hover:bg-default/40'>
            <Image src='/logo.png' alt='logo' width={40} height={40} />
          </Link>
        </div>
        <div className='mr-2 flex items-center gap-1'>
          <Workspaces />
          <Recent />
          <Starred />
          <Button onPress={() => onOpen()} className='flex min-h-10 items-center gap-2 bg-colorBoardBar px-4 font-medium text-primary' startContent={<Add size={24} />}>
            Create
          </Button>
        </div>
      </div>
      <div className='relative flex items-center gap-4'>
        <InputSearch />

        <div className='flex items-center gap-4'>
          <Notifications />
          <Messages />
        </div>
        <ExpandButton isIconOnly content={<ContentUser />}>
          <Avatar src={userInfo?.picture} className='flex !size-8 flex-shrink-0' />
        </ExpandButton>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modalTitle='Create new board'
        modalFooter={
          <div className='flex items-center gap-2'>
            <Button variant='light' color='default' onClick={onOpenChange} className='px-6 py-3'>
              Cancel
            </Button>
            <Button isLoading={onSending} onClick={handleConfirmCreateNewBoard} className='bg-colorBoardContent px-6 py-3 text-white'>
              Create
            </Button>
          </div>
        }
      >
        <ModalBodyCreateNewBoard handleChange={handleChange} titleBoard={titleBoard} handleConfirmCreateNewBoard={handleConfirmCreateNewBoard} />
      </Modal>
    </header>
  )
}

type TModalBodyCreateNewBoard = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  titleBoard: string
  handleConfirmCreateNewBoard: () => void
}

const ModalBodyCreateNewBoard = ({ handleChange, titleBoard, handleConfirmCreateNewBoard }: TModalBodyCreateNewBoard) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <label>
          Title <span className='text-red-700'>*</span>
        </label>
        <Input
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleConfirmCreateNewBoard()
            }
          }}
          value={titleBoard}
          placeholder={`Enter your board name`}
          onChange={handleChange}
          isRequired
          type='text'
        />
      </div>
    </div>
  )
}

export default Header
