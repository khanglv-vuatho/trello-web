'use client'

import React, { memo } from 'react'
import { Drawer as VaulDrawer } from 'vaul'

type VaulDrawerProps = {
  isOpen: boolean
  onClose: () => void
  className?: string
  children: React.ReactNode
}

const Drawer = ({ isOpen, onClose, className, children, ...props }: VaulDrawerProps) => {
  return (
    <VaulDrawer.Root open={isOpen} onOpenChange={onClose} {...props}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className='fixed inset-0 bg-black/40' />
        <VaulDrawer.Content className={`bg-gray-100 flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none ${className}`}>
          <div className='flex flex-col gap-2 items-center justify-center'>
            <div className='h-10 w-12 bg-red-300 rounded-full' />
            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  )
}

export default memo(Drawer)
