'use client'

import { googleLogout } from '@react-oauth/google'
import React, { useEffect, useRef, useState } from 'react'

import { Apps as AppsIcon, NotificationsNoneOutlined as NotificationsIcon } from '@mui/icons-material'
import { Avatar, Badge, Button, Input, useDisclosure } from '@nextui-org/react'
import { Add, ArrowDown2, Logout, Message, SearchNormal1, User } from 'iconsax-react'

import ExpandButton from '@/components/ExpandButton'
import { LoadingSearch } from '@/components/Icons'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { deleteCookie, getCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Notifications } from '@/types'
import { NOTIFICATION_STATUS } from '@/constants'
import Image from 'next/image'

function Header() {
  const [onSearching, setOnSearching] = useState<boolean>(false)
  const [onSending, setOnSending] = useState<boolean>(false)
  const [onFetching, setOnFetching] = useState<boolean>(false)
  const [onFetchingNotification, setOnFetchingNotification] = useState<boolean>(false)

  const [searchValue, setSearchValue] = useState<string>('')
  const [notifications, setNotifications] = useState<Notifications[]>([])
  console.log({ notifications })
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

  const messages = [
    {
      name: 'Nhật Duy',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'tâm này khó rùi',
      lastAuthor: 'me',
      time: '2 phút',
      unread: false,
    },
    {
      name: 'Vu Thi Ngoc Nhu',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: '🤣🤣🤣',
      lastAuthor: 'me',
      time: '3 phút',
      unread: false,
    },
    {
      name: 'Nguyễn Hồng Anh',
      avatar: '/placeholder.svg?height=40&width=40',
      lastAuthor: 'other',
      lastMessage: 'bạn sốt òi',
      time: '6 phút',
      unread: false,
    },
    {
      name: 'Nguyễn Ngọc Sơn',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Đã bày tỏ cảm xúc 😆 về tin ...',
      lastAuthor: 'other',
      time: '29 phút',
      unread: true,
    },
    {
      name: 'Khiết',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Dạ cũng cũng kk',
      lastAuthor: 'other',
      time: '4 giờ',
      unread: false,
    },
    {
      name: 'Không có tay mơ 🎾',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Dì: Sân ở ngoài nhen',
      lastAuthor: 'other',
      time: '6 giờ',
      unread: true,
    },
  ]

  const listRightHeader: {
    id: number
    children: React.ReactNode
    content: React.ReactNode
  }[] = [
    {
      id: 1,
      children: (
        <Badge content={notifications?.filter((n) => n.status === NOTIFICATION_STATUS.UNREAD).length} shape='circle' color='danger' placement='top-right' size='sm' classNames={{ badge: '!size-5' }}>
          <NotificationsIcon />
        </Badge>
      ),
      content: (
        <div className='flex max-h-[300px] w-[340px] flex-col items-center overflow-auto py-2'>
          {notifications?.length === 0 ? (
            <div className='flex flex-col items-center text-center'>
              <DotLottieReact className='w-80' src='https://lottie.host/27603ce5-73cf-4072-81df-1fba472f7e5c/8Th9oMgq8s.json' loop autoplay />
              <h2 className='text-lg font-medium text-gray-900'>No notifications yet</h2>
              <p className='mb-4 text-sm text-gray-500'>Your notifications will appear here</p>
            </div>
          ) : (
            notifications?.map((notification) => (
              <div key={notification._id} className='flex w-full cursor-pointer gap-2 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100'>
                <Avatar as={Link} href={`/profile/${notification._id}`} className='size-10 flex-shrink-0' src={notification.ownerId} />
                <div className='flex-1 space-y-1'>
                  <p className='text-sm'>
                    <span className='font-semibold'>{notification.authorId}</span> <span>{notification.invitation?.boardTitle}</span>
                  </p>
                  <time className='text-xs text-blue-600'>{notification.createdAt}</time>
                </div>
                <Button variant='bordered' size='sm' className='shrink-0'>
                  Accept
                </Button>
              </div>
            ))
          )}
        </div>
      ),
    },
    {
      id: 2,
      children: (
        <Badge content='7' shape='circle' color='danger' placement='top-right' size='sm' classNames={{ badge: '!size-5' }}>
          <Message />
        </Badge>
      ),
      content: (
        <div className='flex max-h-[300px] w-[340px] flex-col items-center overflow-auto py-2'>
          {messages?.length === 0 ? (
            <div className='flex flex-col items-center text-center'>
              <DotLottieReact className='w-40' src='https://lottie.host/dcb44d07-dc8a-4829-b466-db327e8a060d/vcpZBuGW76.json' loop autoplay />
              <h2 className='text-lg font-medium text-gray-900'>No messages yet</h2>
              <p className='mb-4 text-sm text-gray-500'>Your conversations will appear here</p>
            </div>
          ) : (
            messages?.map((message, index) => (
              <div key={index} className={`flex w-full cursor-pointer items-center gap-2 rounded-lg p-3 transition-all duration-300 ease-in-out hover:bg-gray-100`}>
                <Avatar src={message?.avatar} className='flex size-10 flex-shrink-0 border-2 border-white shadow-sm' />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between'>
                    <h3 className='font-semibold text-gray-900'>{message?.name}</h3>
                    <span className='text-xs text-gray-500'>{message?.time}</span>
                  </div>
                  <p className='truncate text-sm text-gray-600'>
                    {message?.lastAuthor === 'me' ? 'Bạn: ' : ''}
                    {message?.lastMessage}
                  </p>
                </div>
                {message?.unread && <div className='size-2 rounded-full bg-blue-500' />}
              </div>
            ))
          )}
        </div>
      ),
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

      console.log({ dataUser })
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
  const handleFetchingNotification = async () => {
    try {
      if (!userInfo) return
      const dataNotification: any = await instance.get(`/v1/notifications?ownerId=${userInfo?.email}`)
      setNotifications(dataNotification)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingNotification(false)
    }
  }

  useEffect(() => {
    setOnFetching(true)
  }, [])

  useEffect(() => {
    !!userInfo && setOnFetchingNotification(true)
  }, [userInfo])

  useEffect(() => {
    onFetching && handleFetchingUser()
  }, [onFetching])

  useEffect(() => {
    onFetchingNotification && handleFetchingNotification()
  }, [onFetchingNotification])

  useEffect(() => {
    onSending && handleCreateNewBoard()
  }, [onSending])

  return (
    <header className='flex h-header items-center justify-between gap-5 overflow-x-auto bg-colorHeader px-4 text-primary'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <div className='flex size-10 cursor-pointer items-center justify-center rounded-[3px] hover:bg-default/40'>
            <AppsIcon />
          </div>
          <Link href={'/'} className='flex min-h-10 cursor-pointer items-center justify-center gap-1 rounded-[3px] px-2 hover:bg-default/40'>
            <Image src='/logo.png' alt='logo' width={40} height={40} />
          </Link>
        </div>
        <div className='mr-2 flex items-center gap-1'>
          {listExpandButton.map((item) => (
            <ExpandButton title={item.title} key={item.title} content={item.content} endContent={<ArrowDown2 size={16} />} />
          ))}
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
        {listRightHeader.map((item) => (
          <ExpandButton key={item.id} isIconOnly content={item.content}>
            {item.children}
          </ExpandButton>
        ))}
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
