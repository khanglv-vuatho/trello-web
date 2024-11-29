'use client'

import { Avatar } from '@nextui-org/react'
import React, { useState } from 'react'
import { IMember } from '@/types'

type TAvatarMember = {
  item: IMember
  onClick: (member: IMember) => void
}

const AvatarMember = ({ item, onClick }: TAvatarMember) => {
  const handleShowMemberDetail = () => {
    console.log('1234')
  }
  return (
    <>
      <Avatar
        onClick={() => onClick(item)}
        {...(item?.picture ? { src: item?.picture } : { name: item?.email?.charAt(0) })}
        classNames={{
          base: 'ring-2 ring-white/30 hover:ring-orange-500',
        }}
      />
    </>
  )
}

export default AvatarMember
