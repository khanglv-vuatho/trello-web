'use client'

import { Avatar } from '@nextui-org/react'
import React, { useState } from 'react'
import { IMember } from '@/types'
import PopoverCustom from '../PopoverCustom'
import { useStoreBoard } from '@/store'

type TAvatarMember = {
  item: IMember
}

const AvatarMember = ({ item }: TAvatarMember) => {
  const { board } = useStoreBoard()
  console.log({ board })
  return (
    <PopoverCustom
      popoverTrigger={
        <Avatar
          {...(item?.picture ? { src: item?.picture } : { name: item?.email?.charAt(0) })}
          classNames={{
            base: 'ring-2 ring-white/30 hover:ring-orange-500',
          }}
        />
      }
    >
      <div
        className='flex w-full flex-col rounded-lg border border-white/20 bg-white/5 p-2 transition-colors hover:bg-white/10'
        style={{ opacity: 1, willChange: 'opacity, transform', transform: 'none' }}
      >
        <div className='flex items-center gap-2 px-2 text-white'>
          <div className='!size-10 rounded-full'>
            <Avatar
              className='size-full text-base data-[focus-visible=true]:-translate-x-0 data-[hover=true]:-translate-x-0 rtl:data-[focus-visible=true]:translate-x-0 rtl:data-[hover=true]:translate-x-0'
              {...(item?.picture ? { src: item?.picture } : { name: item?.email?.charAt(0) })}
            />
          </div>
          <div className='flex flex-col'>
            <p>{item?.email}</p>
            <p className='text-xs text-white/60'>{board?.ownerId === item?.email ? 'Owner' : 'Member'}</p>
          </div>
        </div>
      </div>
    </PopoverCustom>
  )
}

export default AvatarMember
