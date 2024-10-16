'use client'

import { googleLogout } from '@react-oauth/google'
import React, { useEffect, useRef, useState } from 'react'

import { Apps as AppsIcon, HelpOutlineOutlined as HelpIcon, NotificationsNoneOutlined as NotificationsIcon } from '@mui/icons-material'
import { Avatar, Badge, Button, Input, useDisclosure } from '@nextui-org/react'
import { Add, ArrowDown2, SearchNormal1, Trello } from 'iconsax-react'

import ExpandButton from '@/components/ExpandButton'
import { LoadingSearch } from '@/components/Icons'
import ImageFallback from '@/components/ImageFallback'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteCookie, getCookie } from 'cookies-next'

type TInitalState = { title: string; description: string }

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

  const listExpandButton: { title: string; content: React.ReactNode }[] = [
    { title: 'Workspaces', content: <>Workspaces</> },
    { title: 'Recent', content: <>Recent</> },
    { title: 'Starred', content: <>Starred</> },
    { title: 'Templates', content: <>Templates</> },
  ]

  const listRightHeader: {
    id: number
    children: React.ReactNode
    content: React.ReactNode
  }[] = [
    {
      id: 1,
      children: (
        <Badge content='7' shape='circle' color='danger' placement='top-right' size='sm' classNames={{ badge: '!size-5' }}>
          <NotificationsIcon />
        </Badge>
      ),
      content: <>Badge</>,
    },
    {
      id: 2,
      children: <HelpIcon />,
      content: <div className=''>HelpIcon</div>,
    },
  ]

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
    if (titleBoard.length <= 3 || titleBoard.length > 50) {
      Toast({ message: 'Board name and description must be at least 4 and max 50 characters', type: 'error' })
    }

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

  const token = getCookie('access_token')
  console.log({ token })
  const handleFetchingUser = async () => {
    try {
      const dataUser: any = await instance.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`)
      storeUser(dataUser)
    } catch (error) {
      if (error) {
        Toast({ message: 'Login Failed123', type: 'error' })
        deleteCookie('access_token')
        router.push('/login')
      }
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  useEffect(() => {
    onFetching && handleFetchingUser()
  }, [onFetching])

  useEffect(() => {
    setOnFetching(true)
  }, [])

  useEffect(() => {
    onSending && handleCreateNewBoard()
  }, [onSending])

  return (
    <header className='flex items-center justify-between px-4 h-header bg-colorHeader text-primary overflow-x-auto gap-5'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <div className='size-10 hover:bg-default/40 rounded-[3px] cursor-pointer flex items-center justify-center'>
            <AppsIcon />
          </div>
          <Link href={'/'} className='flex items-center justify-center min-h-10 gap-1 px-2 hover:bg-default/40 rounded-[3px] cursor-pointer'>
            <Trello size='24' color='#fff' variant='Bold' />
            <p className='text-xl font-bold'>Trello</p>
          </Link>
        </div>
        <div className='flex items-center gap-1 mr-2'>
          {listExpandButton.map((item) => (
            <ExpandButton title={item.title} key={item.title} content={item.content} endContent={<ArrowDown2 size={16} />} />
          ))}
          <Button onPress={() => onOpen()} className='flex items-center gap-2 font-medium text-primary px-4 min-h-10 bg-colorBoardBar' startContent={<Add size={24} />}>
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
              <LoadingSearch className='animate-spin absolute right-1.5 text-white size-5 ' />
            ) : (
              !!searchValue.length && <Add size={24} className='rotate-45 text-primary cursor-pointer absolute right-1' onClick={_handleClear} />
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
        {listRightHeader.map((item) => (
          <ExpandButton key={item.id} isIconOnly content={item.content}>
            {item.children}
          </ExpandButton>
        ))}
        <ExpandButton isIconOnly content={<ContentUser />}>
          <Avatar src={userInfo?.picture} className='flex flex-shrink-0 max-w-8 max-h-8' />
        </ExpandButton>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modalTitle='Create new board'
        modalFooter={
          <div className='flex items-center gap-2'>
            <Button variant='light' color='default' onClick={onOpenChange} className='py-3 px-6'>
              Cancel
            </Button>
            <Button isLoading={onSending} onClick={() => setOnSending(true)} className='bg-colorBoardContent text-white py-3 px-6'>
              Create
            </Button>
          </div>
        }
      >
        <ModalBodyCreateNewBoard handleChange={handleChange} titleBoard={titleBoard} />
      </Modal>
    </header>
  )
}

type TModalBodyCreateNewBoard = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  titleBoard: string
}

const ModalBodyCreateNewBoard = ({ handleChange, titleBoard }: TModalBodyCreateNewBoard) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <label>
          Title <span className='text-red-700'>*</span>
        </label>
        <Input value={titleBoard} placeholder={`Enter your board name`} onChange={handleChange} isRequired type='text' />
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
    <div className='min-w-[200px] flex flex-col gap-2 p-2'>
      <div className='flex items-center gap-2'>
        <ImageFallback src={userInfo?.picture as string} className='w-8 h-8 rounded-full' height={32} width={32} alt={userInfo?.given_name as string} />
        <div className='flex flex-col'>
          <p>{userInfo?.given_name}</p>
          <p>{userInfo?.email}</p>
        </div>
      </div>
      <Button onPress={handleLogout} className='bg-colorBoardBar text-white py-2 w-full'>
        Đăng xuất
      </Button>
    </div>
  )
}

export default Header
