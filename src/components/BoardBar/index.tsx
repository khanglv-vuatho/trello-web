'use client'

import { Avatar, AvatarGroup } from '@nextui-org/react'
import { AddToDrive as AddToDriveIcon, Dashboard as DashboardIcon, VpnLock as VpnLockIcon, Bolt as BoltIcon, FilterList as FilterListIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material'

import ExpandButton from '@/components/ExpandButton'
import { IBoard } from '@/types'
import { capitalizeFirstLetter } from '@/utils'

function BoardBar({ board }: { board: IBoard }) {
  const listBoardBar: { startContent: any; title: string; content: React.ReactNode }[] = [
    {
      startContent: <DashboardIcon />,
      title: board?.title,
      content: <>LuongViKhang MERN Stack Board</>,
    },
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

  return (
    <div className='bg-colorBoardBar h-boardBar flex items-center justify-between px-4 overflow-x-auto gap-5'>
      <div className='flex items-center gap-2'>
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
