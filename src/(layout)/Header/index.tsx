'use client'

import React, { useEffect, useRef, useState } from 'react'

import { Apps as AppsIcon, NotificationsNoneOutlined as NotificationsIcon, HelpOutlineOutlined as HelpIcon } from '@mui/icons-material'
import { Avatar, Badge, Button, Input, useDisclosure } from '@nextui-org/react'
import { Add, ArrowDown2, SearchNormal1, Trello } from 'iconsax-react'

import ExpandButton from '@/components/ExpandButton'
import { LoadingSearch } from '@/components/Icons'
import { UserButton } from '@clerk/nextjs'
import Modal from '@/components/Modal'
import instance from '@/services/axiosConfig'
import Toast from '@/components/Toast'
import { useRouter } from 'next/navigation'

type TInitalState = { title: string; description: string }

function Header() {
  const [searchValue, setSearchValue] = useState('')
  const [onSearching, setOnSearching] = useState(false)
  const [onSending, setOnSending] = useState(false)

  const router = useRouter()

  const initalState: TInitalState = {
    title: '',
    description: '',
  }
  const [infoNewColumn, setInfoNewColumn] = useState<TInitalState>(initalState)
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
    const { name, value } = e.target

    setInfoNewColumn({ ...infoNewColumn, [name]: value })
  }

  const handleCreateNewColumn = async () => {
    try {
      const data: any = await instance.post('/v1/boards', { ...infoNewColumn, type: 'public' })

      Toast({ message: 'Create Board Successful', type: 'success' })
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

  useEffect(() => {
    onSending && handleCreateNewColumn()
  }, [onSending])

  return (
    <header className='flex items-center justify-between px-4 h-header bg-colorHeader text-primary overflow-x-auto gap-5'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <div className='size-10 hover:bg-default/40 rounded-[3px] cursor-pointer flex items-center justify-center'>
            <AppsIcon />
          </div>
          <div className='flex items-center justify-center min-h-10 gap-1 px-2 hover:bg-default/40 rounded-[3px] cursor-pointer'>
            <Trello size='24' color='#fff' variant='Bold' />
            <p className='text-xl font-bold'>Trello</p>
          </div>
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
        <UserButton />
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modalTitle='Create new column'
        modalBody={<ModalBodyCreateNewColumn handleChange={handleChange} initalState={initalState} infoNewColumn={infoNewColumn} />}
        modalFooter={
          <div className='flex items-center gap-2'>
            <Button variant='light' color='default' onClick={onOpenChange} className='py-3 px-6'>
              Cancel
            </Button>
            <Button onClick={() => setOnSending(true)} className='bg-colorBoardContent text-white py-3 px-6'>
              Create
            </Button>
          </div>
        }
      />
    </header>
  )
}

type TModalBodyCreateNewColumn = {
  initalState: TInitalState
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  infoNewColumn: {
    [key: string]: string
  }
}
const ModalBodyCreateNewColumn = ({ initalState, handleChange, infoNewColumn }: TModalBodyCreateNewColumn) => {
  return (
    <div className='flex flex-col gap-4'>
      {Object.keys(initalState).map((key) => (
        <div key={key} className='flex flex-col gap-2'>
          <label>
            {key} <span className='text-red-700'>*</span>
          </label>
          <Input name={key} value={infoNewColumn[key]} placeholder={`Enter ${key}`} onChange={handleChange} isRequired type='text' />
        </div>
      ))}
    </div>
  )
}

export default Header
