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

import { Messages, Notifications, Recent, Starred, Workspaces } from './(sections)'

function Header() {
  const [onSearching, setOnSearching] = useState<boolean>(false)
  const [onSending, setOnSending] = useState<boolean>(false)
  const [onFetching, setOnFetching] = useState<boolean>(false)

  const [searchValue, setSearchValue] = useState<string>('')
  const router = useRouter()

  const { storeUser } = useStoreUser()

  const userInfo = useStoreUser((state) => state.userInfo)
  const [titleBoard, setTitleBoard] = useState<string>('')
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const inputRef = useRef<any>(null)

  const _handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnSearching(true)
    setSearchValue(e.target.value)
  }

  const _handleSearching = async () => {
    try {
      // const { data } = instance.post("/home/search", {
      //   value: searchValue,
      // })
    } catch (error) {
      console.log(error)
    } finally {
      setOnSearching(false)
    }
  }

  const _handleClear = () => {
    setSearchValue('')
    inputRef.current.focus()
  }

  const searchTimer = useRef<any>(null)

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

  useEffect(() => {
    if (onSearching) {
      searchTimer.current = setTimeout(() => {
        _handleSearching()
      }, 500)
    }
    return () => {
      clearTimeout(searchTimer.current)
    }
  }, [onSearching])

  const google_token = getCookie('google_token')

  const handleGetDetailUser = async ({ payload }: { payload: any }) => {
    try {
      const dataUser: any = await instance.post(`/v1/users/login`, payload)

      storeUser(dataUser)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchingUser = async () => {
    try {
      const dataUser: any = await instance.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${google_token}`)
      await handleGetDetailUser({ payload: dataUser })
      storeUser(dataUser)
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
      <div className='flex items-center gap-4'>
        <Input
          ref={inputRef}
          placeholder='Search'
          autoComplete='off'
          variant='bordered'
          startContent={<SearchNormal1 size={24} className='text-primary' />}
          endContent={
            onSearching && !!searchValue.length ? (
              <LoadingSearch className='absolute right-1.5 size-5 animate-spin text-white' />
            ) : (
              !!searchValue.length && <Add size={24} className='absolute right-1 rotate-45 cursor-pointer text-primary' onClick={_handleClear} />
            )
          }
          classNames={{
            inputWrapper: 'max-h-10 border-primary data-[hover=true]:border-primary group-data-[focus=true]:border-primary',
            input: 'text-primary placeholder:text-primary data-[has-start-content=true]:pr-4',
          }}
          className='min-w-[120px]'
          value={searchValue}
          onChange={_handleChange}
        />

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

const ContentUser = () => {
  const router = useRouter()

  const userInfo = useStoreUser((state) => state.userInfo)

  const handleLogout = () => {
    deleteCookie('access_token')
    googleLogout()

    router.push('/login')
  }

  return (
    <div className='flex min-w-[200px] flex-col gap-2 p-2'>
      <div className='flex items-center gap-2'>
        <Avatar src={userInfo?.picture as string} className='flex !size-8 flex-shrink-0 rounded-full' alt={userInfo?.given_name as string} />
        <div className='flex flex-col'>
          <p>{userInfo?.given_name}</p>
          <p>{userInfo?.email}</p>
        </div>
      </div>
      {/* line */}
      <div className='h-[1px] w-full bg-gray-200' />
      <div className='flex flex-col gap-2'>
        <Button as={Link} href={`/profile/${userInfo?.email}`} variant='light' startContent={<User size={20} />} className='flex w-full justify-start gap-2 py-2 text-sm'>
          Detail Profile
        </Button>
        {/* line */}
        <div className='h-[1px] w-full bg-gray-200' />
        <Button startContent={<Logout size={20} />} variant='light' onPress={handleLogout} className='flex w-full justify-start gap-2 py-2 text-sm'>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Header
