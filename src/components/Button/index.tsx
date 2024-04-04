'use client'

import { Button, ButtonProps } from '@nextui-org/react'
import CloseIcon from '@mui/icons-material/Close'
import { twMerge } from 'tailwind-merge'

type TAddButton = { children: string; className?: string } & ButtonProps
export const AddButton = ({ children, className, ...props }: TAddButton) => {
  return (
    <Button {...props} className={twMerge('px-4 py-2 text-white bg-green-400', className)}>
      {children}
    </Button>
  )
}

export const CloseButton = ({ ...props }: ButtonProps) => {
  return (
    <Button {...props} isIconOnly radius='full' className='p-2 bg-transparent text-red-500'>
      <CloseIcon />
    </Button>
  )
}
