'use client'

import { Avatar, AvatarGroup, Button, Input } from '@nextui-org/react'
import { AddToDrive as AddToDriveIcon, Dashboard as DashboardIcon, VpnLock as VpnLockIcon, Bolt as BoltIcon, FilterList as FilterListIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material'

import ExpandButton from '@/components/ExpandButton'
import { IBoard } from '@/types'
import { capitalizeFirstLetter } from '@/utils'
import { useState } from 'react'
import instance from '@/services/axiosConfig'
import Toast from '../Toast'
import { useStoreBoard } from '@/store'

function BoardBar({ board }: { board: IBoard }) {
  const { storeBoard } = useStoreBoard()

  const [isFixTitleBoard, setIsFixTitleBoard] = useState<boolean>(false)
  const [titleBoard, setTitleBoard] = useState<string>(board?.title)
  const listBoardBar: { startContent: any; title: string; content: React.ReactNode }[] = [
    {
      startContent: <VpnLockIcon />,
      title: capitalizeFirstLetter(board?.type),
      content: <>Public/Private Workspace</>,
    },
    {
      startContent: <AddToDriveIcon />,
      title: 'Add To Google Drive',
      content: <>AddToDriveIcon</>,
    },
    {
      startContent: <BoltIcon />,
      title: 'Automation',
      content: <>Automation</>,
    },
    {
      startContent: <FilterListIcon />,
      title: 'Filters',
      content: <>Filters</>,
    },
  ]
  const handleRenameTitleBoard = async () => {
    if (titleBoard === board?.title || titleBoard === '') return setIsFixTitleBoard(false)

    if (titleBoard?.length <= 3 || titleBoard?.length > 50) {
      Toast({ message: 'Board name must be at least 4 and max 50 characters', type: 'error' })
      return setIsFixTitleBoard(false)
    }

    const payload = { title: titleBoard }

    storeBoard({ ...board, title: titleBoard })

    try {
      await instance.put(`/v1/boards/${board?._id}`, payload)
      Toast({ message: 'Board renamed successfully', type: 'success' })
    } catch {
      Toast({ message: 'Failed to rename board', type: 'error' })
    } finally {
      setIsFixTitleBoard(false)
    }
  }

  return (
    <div className='bg-colorBoardBar h-boardBar flex items-center justify-between px-4 overflow-x-auto gap-5'>
      <div className='flex items-center gap-2'>
        {isFixTitleBoard ? (
          <Input
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleRenameTitleBoard()
              }
            }}
            variant='bordered'
            autoFocus
            onBlur={() => handleRenameTitleBoard()}
            value={titleBoard}
            onChange={(e) => {
              setTitleBoard(e.target.value)
            }}
            classNames={{
              inputWrapper: 'border-white/80 data-[hover=true]:white/80 group-data-[focus=true]:border-white/80',
            }}
            className='w-[100px] min-w-[100px] max-w-[100px] border-white/80 text-white'
          />
        ) : (
          <Button
            className='flex items-center gap-2 font-medium text-primary px-4 min-h-10 rounded-[4px] bg-transparent hover:bg-white/40 w-[100px] min-w-[100px] max-w-[100px]'
            startContent={<DashboardIcon />}
            onPress={() => setIsFixTitleBoard(!isFixTitleBoard)}
          >
            {board.title}
          </Button>
        )}
        {listBoardBar.map((item, index) => (
          <ExpandButton key={index} title={item.title} content={item.content} startContent={item.startContent} style='font-normal'></ExpandButton>
        ))}
      </div>
      <div className='flex items-center gap-4'>
        <ExpandButton title='Invite' content={<>Invite</>} startContent={<PersonAddIcon />} variant='bordered' style='font-normal rounded-lg border-1'></ExpandButton>
        <AvatarGroup max={3} total={10} className='*:min-h-10 *:cursor-pointer'>
          <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026024d' />
          <Avatar src='https://i.pravatar.cc/150?u=a04258a2462d826712d' />
          <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026704d' />
          <Avatar src='https://i.pravatar.cc/150?u=a04258114e29026708c' />
          <Avatar src='https://i.pravatar.cc/150?u=a04258114e29026708c' />
          <Avatar src='https://i.pravatar.cc/150?u=a04258114e29026708c' />
        </AvatarGroup>
      </div>
    </div>
  )
}

export default BoardBar
