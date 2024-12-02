'use client'

import { Avatar } from '@nextui-org/react'
import React, { useState } from 'react'
import { IMember } from '@/types'
import PopoverCustom from '../PopoverCustom'

type TAvatarMember = {
  item: IMember
  onClick: (member: IMember) => void
}

const AvatarMember = ({ item, onClick }: TAvatarMember) => {
  const handleShowMemberDetail = () => {
    console.log('1234')
  }
  return (
    <PopoverCustom
      popoverTrigger={
        <Avatar
          onClick={() => onClick(item)}
          {...(item?.picture ? { src: item?.picture } : { name: item?.email?.charAt(0) })}
          classNames={{
            base: 'ring-2 ring-white/30 hover:ring-orange-500',
          }}
        />
      }
    >
      <div
        className='flex w-full flex-col rounded-lg border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10'
        style={{ opacity: 1, willChange: 'opacity, transform', transform: 'none' }}
      >
        <p>{item.name}</p>
      </div>
    </PopoverCustom>
  )
}

export default AvatarMember
