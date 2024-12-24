'use client'
import Conversation from '@/components/PinMessage/Conversation'
import InputSendMessage from '@/components/PinMessage/InputSendMessage'
import { MESSAGE_TYPES } from '@/constants'
import instance from '@/services/axiosConfig'
import { useStoreConversation, useStoreListMessagesPins, useStoreUser } from '@/store'
import { TGroupMessage, TListMessages, TMessage } from '@/types'
import { groupMessagesBySender } from '@/utils'
import { Close } from '@mui/icons-material'
import { Avatar, Tooltip } from '@nextui-org/react'
import { Minus } from 'iconsax-react'
import { useEffect, useMemo, useState } from 'react'

const PinMessage = () => {
  const { userInfo } = useStoreUser()
  const { listMessagesPins } = useStoreListMessagesPins()
  const { getMessagesByConversationId } = useStoreConversation()
  const [currentChat, setCurrentChat] = useState<TListMessages | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const { conversation, storeConversation } = useStoreConversation()
  const [infoTyping, setInfoTyping] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async ({ message, attachment, type }: { message: string; attachment?: File; type: keyof typeof MESSAGE_TYPES }) => {
    try {
      setIsSending(true)
      if (!userInfo?.email) return
      const newMessage: TMessage = {
        message,
        type,
        senderId: userInfo?.email,
        ...(attachment && { attachment }),
        createdAt: Date.now()
      }
      storeConversation([...conversation, newMessage])

      setMessage('')

      console.log('send message')
    } catch (error) {
      console.log(error)
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    setCurrentChat(null)
    setIsOpen(false)
  }
  const handleOpen = (item: TListMessages) => {
    setCurrentChat(item)
    setIsOpen(true)
  }

  const handleMinimize = () => {
    setIsOpen(false)
  }

  const handleFetchMessages = async () => {
    setIsFetching(true)
    const messageDetails: any = await getMessagesByConversationId(currentChat?.conversationId as string)
    storeConversation(messageDetails)
    setIsFetching(false)
  }

  useEffect(() => {
    if (isFetching) {
      handleFetchMessages()
    }
  }, [isFetching])

  useEffect(() => {
    setIsFetching(true)
  }, [])

  const groupMessage = useMemo(() => {
    return groupMessagesBySender(conversation as any) as any
  }, [conversation])

  return (
    <div className='absolute bottom-4 right-4 z-50 flex items-end gap-4'>
      <div className={`flex-col ${isOpen ? 'flex' : 'hidden'} mb-[-16px] rounded-lg bg-white`}>
        <div className='flex items-center justify-between border-b border-gray-300 px-3 py-2'>
          <div className='flex items-center gap-2'>
            <Avatar src={currentChat?.avatar} className='!size-9' />
            <p className=''>{currentChat?.name}</p>
          </div>
          <div className='flex items-center gap-2'>
            <span onClick={handleMinimize} className='cursor-pointer'>
              <Minus size={20} className='text-black' />
            </span>
            <span onClick={handleClose} className='cursor-pointer'>
              <Close className='!size-5 text-black' />
            </span>
          </div>
        </div>
        {currentChat && <Conversation infoTyping={infoTyping} currentChat={currentChat} conversation={groupMessage as any} />}
        <InputSendMessage message={message} setMessage={setMessage} currentChat={currentChat} handleSendMessage={handleSendMessage} isSending={isSending} />
      </div>
      <div className='flex flex-col gap-2'>
        {listMessagesPins.map((item) => {
          return (
            <Tooltip key={item.avatar} content={item.name} placement='left'>
              <div className='group relative !size-10 rounded-full bg-red-200' onClick={() => handleOpen(item)}>
                <Avatar src={item.avatar} />
                <div className='absolute right-0 top-0 hidden !size-4 max-h-4 w-4 max-w-4 items-center justify-center rounded-full bg-white group-hover:flex'>
                  <Close className='!size-3' />
                </div>
              </div>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

export default PinMessage
