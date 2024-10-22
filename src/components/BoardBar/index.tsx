'use client'

import { Avatar, AvatarGroup, Button, Input } from '@nextui-org/react'
import { AddToDrive as AddToDriveIcon, Dashboard as DashboardIcon, VpnLock as VpnLockIcon, Bolt as BoltIcon, FilterList as FilterListIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material'

import ExpandButton from '@/components/ExpandButton'
import { IBoard } from '@/types'
import { capitalizeFirstLetter } from '@/utils'
import { memo, useEffect, useState } from 'react'
import instance from '@/services/axiosConfig'
import Toast from '../Toast'
import { useStoreBoard } from '@/store'
import Modal from '../Modal'

function BoardBar({ board }: { board: IBoard }) {
  const MAX_USER_SHOW = 3

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

  const [isOpenModalInviteMember, setIsOpenModalInviteMember] = useState(false)
  const [isInvitingMember, setIsInvitingMember] = useState(false)
  const [emailInviteMember, setEmailInviteMember] = useState('')
  const handleToggleModalInviteMember = () => {
    setIsOpenModalInviteMember(!isOpenModalInviteMember)
  }

  const handleInviteMember = () => {
    setIsInvitingMember(true)
  }

  const handleInviteMemberApi = async () => {
    try {
      await instance.post(`/v1/boards/${board?._id}/members`, { memberGmails: [emailInviteMember] })
      Toast({ message: `Invite member ${emailInviteMember} successfully`, type: 'success' })
      setEmailInviteMember('')
      handleToggleModalInviteMember()
    } catch (error) {
      console.log({ error })
    } finally {
      setIsInvitingMember(false)
    }
  }

  useEffect(() => {
    isInvitingMember && handleInviteMemberApi()
  }, [isInvitingMember])
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
        <Button onClick={handleToggleModalInviteMember} startContent={<PersonAddIcon />} variant='bordered'>
          Invite
        </Button>
        <Modal isOpen={isOpenModalInviteMember} onOpenChange={handleToggleModalInviteMember} modalTitle='Invite Member'>
          <div className='-mt-2 flex flex-col gap-4 py-2'>
            <Input
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleInviteMember()
                }
              }}
              value={emailInviteMember}
              placeholder={'Enter your invite email'}
              onChange={(e) => {
                setEmailInviteMember(e.target.value)
              }}
              isRequired
              type='email'
            />
          </div>
          <div className='flex w-full justify-end'>
            <Button isLoading={isInvitingMember} className='bg-primary2 text-white' onClick={handleInviteMember}>
              Invite
            </Button>
          </div>
        </Modal>
        {board?.memberGmails?.length > 0 ? (
          <AvatarGroup max={MAX_USER_SHOW} total={Number(board?.memberGmails?.length - MAX_USER_SHOW)} className='*:min-h-10 *:cursor-pointer'>
            {board?.memberGmails?.map((item) => (
              <Avatar key={item?.email} src={item?.picture} />
            ))}
          </AvatarGroup>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default memo(BoardBar)
