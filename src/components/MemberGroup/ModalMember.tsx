'use client'

import ImageFallback from '@/components/ImageFallback'
import Modal from '@/components/Modal'
import { MEMBER_STATUS } from '@/constants'
import { useStoreBoard, useStoreUser } from '@/store'
import { IMember } from '@/types'
import { Avatar, Button, Input } from '@nextui-org/react'
import { Trash } from 'iconsax-react'
import { useState } from 'react'

type TModalMember = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  memberGmails: IMember[]
}

const ModalMember = ({ isOpen, onOpenChange, memberGmails }: TModalMember) => {
  const { board, deleteMemberBoard } = useStoreBoard()
  const { userInfo } = useStoreUser()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = memberGmails?.filter((item) => item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || item?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()))

  const handleDeleteMember = async (member: IMember) => {
    try {
      if (!board?._id) return
      await deleteMemberBoard(board?._id, member?.email)
      console.log({ member })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='pt-[200px]'>
      <Modal size='2xl' isOpen={isOpen} onOpenChange={onOpenChange} modalTitle='Invited Members'>
        <Input type='text' placeholder='Search by name, email' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='mb-4 w-full' />
        <div className='flex max-h-[400px] min-h-[200px] flex-col gap-4 overflow-y-auto p-2'>
          {filteredData?.map((item) => (
            <div key={item?.name} className='flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md'>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <div className='size-10'>
                    {item?.status === MEMBER_STATUS.PENDING ? (
                      <Avatar className='size-full rounded-full' name={item?.name?.charAt(0) || ''} />
                    ) : (
                      <ImageFallback src={item?.picture || ''} alt={item?.name || ''} height={50} width={50} className='size-full rounded-full object-cover' />
                    )}
                  </div>
                  <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${item?.status === MEMBER_STATUS.ACCEPTED ? 'bg-green-500' : 'bg-yellow-500'}`} />
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='font-semibold text-gray-900'>{item?.name}</p>
                  <p className='text-sm text-gray-500'>{item?.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item?.status === MEMBER_STATUS.ACCEPTED ? 'bg-green-100 text-green-700' : item?.status === MEMBER_STATUS.PENDING ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item?.status === MEMBER_STATUS.PENDING ? 'Pending' : 'Accepted'}
                </span>
                {board?.ownerId === userInfo?.email && (
                  <Button isIconOnly color='danger' variant='light' radius='full' size='sm' className='!size-10' onClick={() => handleDeleteMember(item)}>
                    <Trash className='text-red-500' />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default ModalMember
