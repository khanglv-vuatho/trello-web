'use client'
import PopoverCustom from '@/components/PopoverCustom'
import { BOARD_TYPE } from '@/constants'
import { VpnLock as VpnLockIcon } from '@mui/icons-material'
import { Button } from '@nextui-org/react'
import { useState } from 'react'

const SelectTypeOfWorkspace = () => {
  const [isPrivateBoard, setIsPrivateBoard] = useState<string>(BOARD_TYPE.PUBLIC)
  const listTypeBoard = [
    {
      type: BOARD_TYPE.PUBLIC,
      description: 'Anyone with the link can access',
    },
    {
      type: BOARD_TYPE.PRIVATE,
      description: 'All team members can access',
    },
  ]
  return (
    <PopoverCustom
      popoverTrigger={
        <Button startContent={<VpnLockIcon />} isIconOnly variant='light' className='!h-10 flex flex-shrink-0 text-white hover:bg-white/10'>
          Workspace Visibility
        </Button>
      }
    >
      <div className='flex flex-col gap-2 bg-gradient-to-br from-blue-600 to-indigo-800'>
        <span className='text-sm'>Workspace Visibility</span>
        <span className='text-xs text-gray-500'>Choose who can see your workspace</span>
        <div className='flex w-full flex-col gap-2'>
          {listTypeBoard.map((item) => (
            <div key={item.type} className={`w-full rounded-lg border px-4 py-2 ${isPrivateBoard === item.type ? 'border-white/50' : 'border-white/10'}`} onClick={() => setIsPrivateBoard(item.type)}>
              {/* uppercase the first letter */}
              <p>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PopoverCustom>
  )
}

export default SelectTypeOfWorkspace
