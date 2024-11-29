'use client'
import { useStoreBoard } from '@/store'
import { IBoard, IMember } from '@/types'
import { AvatarGroup, Avatar } from '@nextui-org/react'
import React from 'react'
import AvatarMember from '@/components/MemberGroup/AvatarMember'

const MemberGroup = () => {
  const MAX_USER_SHOW = 3
  const { board } = useStoreBoard()

  if (!board) return

  const handleShowAllMember = () => {
    console.log('show all member')
  }

  const handleShowMemberDetail = (member: IMember) => {
    console.log(member)
  }

  return (
    <AvatarGroup
      max={MAX_USER_SHOW}
      total={Number(board?.memberGmails?.length - MAX_USER_SHOW)}
      renderCount={(count) => (
        <Avatar
          onClick={handleShowAllMember}
          key={count}
          name={`+${count}`}
          classNames={{
            base: 'ring-2 ring-white/30 hover:ring-orange-500',
          }}
        />
      )}
      className='*:min-h-10 *:cursor-pointer'
    >
      {board?.memberGmails?.map((item) => <AvatarMember key={item?.email} item={item} onClick={handleShowMemberDetail} />)}
    </AvatarGroup>
  )
}

export default MemberGroup
