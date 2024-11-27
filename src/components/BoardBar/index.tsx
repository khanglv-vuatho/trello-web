'use client'

import { AddToDrive as AddToDriveIcon, Bolt as BoltIcon, Dashboard as DashboardIcon, FilterList as FilterListIcon, PersonAdd as PersonAddIcon, VpnLock as VpnLockIcon } from '@mui/icons-material'
import { Avatar, AvatarGroup, Button, Input } from '@nextui-org/react'

import ExpandButton from '@/components/ExpandButton'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import { BOARD_TYPE, NOTIFICATION_TYPES } from '@/constants'
import instance from '@/services/axiosConfig'
import { useStoreBoard } from '@/store'
import { memo, useEffect, useState } from 'react'

function BoardBar() {
  const MAX_USER_SHOW = 3

  const { storeBoard, board } = useStoreBoard()

  const [isFixTitleBoard, setIsFixTitleBoard] = useState<boolean>(false)
  const [isPrivateBoard, setIsPrivateBoard] = useState<string>(board?.type || BOARD_TYPE.PUBLIC)
  const [titleBoard, setTitleBoard] = useState<string>(board?.title || '')

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
  console.log({ isPrivateBoard })
  const listBoardBar: { startContent: any; title: string; content: React.ReactNode }[] = [
    {
      startContent: <VpnLockIcon />,
      title: 'Workspace Visibility',
      content: (
        <div className='flex flex-col gap-2 bg-gradient-to-br from-blue-600 to-indigo-800'>
          <span className='text-sm'>Workspace Visibility</span>
          <span className='text-xs text-gray-500'>Choose who can see your workspace</span>
          <div className='flex w-full flex-col gap-2'>
            {listTypeBoard.map((item) => (
              <div
                key={item.type}
                className={`w-full rounded-lg border px-4 py-2 ${isPrivateBoard === item.type ? 'border-white/50' : 'border-white/10'}`}
                onClick={() => setIsPrivateBoard(item.type)}
              >
                {/* uppercase the first letter */}
                <p>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ),
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

    storeBoard({ ...board!, title: titleBoard })

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
    if (!emailInviteMember) return
    setIsInvitingMember(true)
  }

  const handleInviteMemberApi = async () => {
    try {
      await instance.post(`/v1/boards/${board?._id}/members`, { memberGmails: [emailInviteMember] })
      Toast({ message: `Invite member ${emailInviteMember} successfully`, type: 'success' })
      setEmailInviteMember('')

      storeBoard({ ...board!, memberGmails: [...(board?.memberGmails || []), { email: emailInviteMember, type: NOTIFICATION_TYPES.PENDING }] })
      handleToggleModalInviteMember()
    } catch (error) {
      console.log({ error })
    } finally {
      setIsInvitingMember(false)
    }
  }

  const handleShowAllMember = () => {
    console.log('show all member')
  }

  useEffect(() => {
    isInvitingMember && handleInviteMemberApi()
  }, [isInvitingMember])

  return (
    <div className='flex h-boardBar items-center justify-between gap-5 overflow-x-auto bg-colorBoardBar px-4'>
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
            className='flex min-h-10 w-[100px] min-w-[100px] max-w-[100px] items-center gap-2 rounded-[4px] bg-transparent px-4 font-medium text-primary hover:bg-white/40'
            startContent={<DashboardIcon />}
            onPress={() => setIsFixTitleBoard(!isFixTitleBoard)}
          >
            {board?.title}
          </Button>
        )}
        {listBoardBar.map((item, index) => (
          <ExpandButton key={index} title={item.title} content={item.content} startContent={item.startContent} style='font-normal'></ExpandButton>
        ))}
      </div>
      <div className='flex items-center gap-4'>
        <Button className='w-full px-4 py-2 text-white' onClick={handleToggleModalInviteMember} startContent={<PersonAddIcon />} variant='bordered'>
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
            <Button isLoading={isInvitingMember} className='bg-primary2 px-1 py-3 text-white' onClick={handleInviteMember}>
              Invite
            </Button>
          </div>
        </Modal>
        {board?.memberGmails?.length && board?.memberGmails?.length > 0 ? (
          <AvatarGroup
            max={MAX_USER_SHOW}
            total={Number(board?.memberGmails?.length - MAX_USER_SHOW)}
            renderCount={(count) => (
              <Avatar
                onClick={handleShowAllMember}
                key={count}
                name={`+${count}`}
                classNames={{
                  base: 'ring-2 ring-white/30 hover:ring-orange-500',
                }}
              />
            )}
            className='*:min-h-10 *:cursor-pointer'
          >
            {board?.memberGmails?.map((item) => (
              <Avatar
                onClick={() => {
                  console.log(item)
                }}
                key={item?.email}
                {...(item?.picture ? { src: item?.picture } : { name: item?.email?.charAt(0) })}
                classNames={{
                  base: 'ring-2 ring-white/30 hover:ring-orange-500',
                }}
              />
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
