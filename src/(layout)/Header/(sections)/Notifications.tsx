'use client'

import { NoItemOverView } from '@/components/OverViewItem'
import PopoverCustom from '@/components/PopoverCustom'
import { NOTIFICATION_STATUS, NOTIFICATION_TYPES } from '@/constants'
import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { TNotifications } from '@/types'
import { NotificationsNoneOutlined } from '@mui/icons-material'
import { Avatar, Badge, Button } from '@nextui-org/react'
import { memo, useEffect, useState } from 'react'

const Notifications = () => {
  const userInfo = useStoreUser((state) => state.userInfo)
  const [notifications, setNotifications] = useState<TNotifications[]>([])
  const [onFetchingNotification, setOnFetchingNotification] = useState<boolean>(false)

  const noData = notifications?.length === 0

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

  const handleRemoveNotification = async (notification: TNotifications) => {
    try {
      await instance.delete(`/v1/notifications/${notification?._id}`)
      setNotifications((prev) => prev.filter((n) => n?._id !== notification?._id))
    } catch (error) {
      console.log(error)
    }
  }

  const handleAcceptNotification = async (notification: TNotifications) => {
    try {
      await instance.put(`/v1/notifications/${notification?._id}`, { status: NOTIFICATION_TYPES.ACCEPTED, email: userInfo?.email, boardId: notification?.invitation?.boardId })
      const newListNotifications = notifications.map((n) => {
        if (n?._id === notification?._id) {
          return { ...n, status: NOTIFICATION_STATUS.READ, invitation: { ...n.invitation, status: NOTIFICATION_TYPES.ACCEPTED } }
        }
        return n
      })
      setNotifications(newListNotifications as TNotifications[])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    !!userInfo?.email && setOnFetchingNotification(true)
  }, [userInfo?.email])

  useEffect(() => {
    onFetchingNotification && handleFetchingNotification()
  }, [onFetchingNotification])

  return (
    <PopoverCustom
      noData={noData}
      popoverTrigger={
        <Button isIconOnly variant='light' className='flex !size-10 flex-shrink-0 text-white hover:bg-white/10'>
          <Badge
            isInvisible={notifications?.filter((n) => n.status === NOTIFICATION_STATUS.UNREAD).length === 0}
            content={notifications?.filter((n) => n.status === NOTIFICATION_STATUS.UNREAD).length}
            shape='circle'
            color='danger'
            placement='top-right'
            size='sm'
            classNames={{ badge: '!size-5' }}
          >
            <NotificationsNoneOutlined />
          </Badge>
        </Button>
      }
    >
      <div className='flex max-h-[300px] w-[340px] flex-col items-center gap-2 overflow-auto py-2'>
        {noData ? (
          <NoItemOverView title='No notifications yet' description='Your notifications will appear here' />
        ) : (
          notifications.map((notification) => (
            <div
              key={notification?._id}
              className='flex w-full flex-col rounded-lg border border-white/20 bg-white/5 transition-colors hover:bg-white/10'
              style={{ opacity: 1, willChange: 'opacity, transform', transform: 'none' }}
            >
              <div className='flex items-start gap-4 p-4'>
                <Avatar className='flex !size-10 flex-shrink-0 ring-1 ring-white/20'></Avatar>
                <div className='min-w-0 flex-1'>
                  <div className='mb-1 flex items-start justify-between'>
                    <p className='font-medium text-white'>{notification?.title}</p>
                    <div className='h-3 ml-2 w-3 animate-pulse rounded-full bg-blue-500 shadow-lg shadow-blue-500/50'></div>
                  </div>
                  <p className='text-sm text-blue-200'>{notification?.createdAt} phút trước</p>
                </div>
              </div>
              {notification?.invitation?.status !== NOTIFICATION_TYPES.ACCEPTED ? (
                <div className='flex items-center justify-end gap-2 bg-white/5 px-4 py-3'>
                  <Button className='!min-h-8 bg-transparent text-xs text-red-400' onClick={() => handleRemoveNotification(notification)}>
                    Remove
                  </Button>
                  <Button className='!min-h-8 bg-white/10 text-xs text-white hover:bg-white/20' onClick={() => handleAcceptNotification(notification)}>
                    Accept
                  </Button>
                </div>
              ) : (
                <div className='flex items-center justify-end gap-2 bg-white/5 px-4 py-3'>
                  <p className='text-xs text-white/50'>Accepted</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </PopoverCustom>
  )
}

export default memo(Notifications)
