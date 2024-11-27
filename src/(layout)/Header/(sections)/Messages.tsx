'use client'

import { Badge, Button, PopoverContent } from '@nextui-org/react'
import { Popover, PopoverTrigger } from '@nextui-org/react'
import { Message } from 'iconsax-react'
import React from 'react'

const Messages = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button isIconOnly variant='light' className='flex !size-10 flex-shrink-0 text-white hover:bg-white/10'>
          <Badge content={1} shape='circle' color='danger' placement='top-right' size='sm' classNames={{ badge: '!size-5' }}>
            <Message />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent>123</PopoverContent>
    </Popover>
  )
}

export default Messages
