'use client'

import NoItemOverView from '@/components/OverViewItem/NoItemOverView'
import PopoverCustom from '@/components/PopoverCustom'
import { useStoreListMessagesPins } from '@/store'
import { Avatar, Badge, Button } from '@nextui-org/react'
import { Message } from 'iconsax-react'

type TListMessages = { id: number; name: string; by: string; message: string; avatar: string; time: string }[]
const Messages = () => {
  const listMessages: TListMessages = [
    {
      id: 1,
      name: 'John Doe',
      by: '12312321@gmail.com',
      message: 'Hello, how are you?',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      time: '12:00'
    },
    {
      id: 2,
      name: 'Hihi',
      by: 'khangluong2002@gmail.com',
      message: 'Hello, h123?',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      time: '12:11'
    }
  ]

  const noData = listMessages.length === 0
  return (
    <PopoverCustom
      noData={noData}
      popoverTrigger={
        <Button isIconOnly variant='light' className='flex !size-10 flex-shrink-0 text-white hover:bg-white/10'>
          <Badge content={1} shape='circle' color='danger' placement='top-right' size='sm' classNames={{ badge: '!size-5' }}>
            <Message />
          </Badge>
        </Button>
      }
    >
      <div className='flex max-h-[300px] w-[340px] flex-col items-center gap-2 overflow-auto py-2'>
        {noData ? (
          <NoItemOverView title='No messages yet' description='Your messages will appear here' />
        ) : (
          listMessages.map((item) => <MessagesContent key={item.id} item={item} />)
        )}
      </div>
    </PopoverCustom>
  )
}

const MessagesContent = ({ item }: { item: TListMessages[number] }) => {
  const { storeListMessagesPins, listMessagesPins } = useStoreListMessagesPins()
  console.log({ listMessagesPins })
  const handleClickToChat = () => {
    const isItemExist = listMessagesPins.some((ping: any) => ping?.id === item?.id) // Kiểm tra item dựa trên id hoặc một thuộc tính định danh
    if (isItemExist) {
      console.log(123)
    } else {
      storeListMessagesPins([...listMessagesPins, item])
    }
  }
  return (
    <div
      className='relative flex w-full items-center gap-2 rounded-lg border border-white/20 bg-white/5 p-2 transition-colors hover:bg-white/10'
      style={{ opacity: 1, willChange: 'opacity, transform', transform: 'none' }}
      onClick={handleClickToChat}
    >
      <div className='size-9'>
        <Avatar src={item.avatar} className='size-full' />
      </div>
      <div className='flex flex-col gap-1 text-white'>
        <p className='text-sm'>{item.name}</p>
        <p className='text-xs text-white/50'>{item.message}</p>
      </div>
    </div>
  )
}

export default Messages
