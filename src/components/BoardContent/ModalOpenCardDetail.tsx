import instance from '@/services/axiosConfig'
import { useStoreBoard, useStoreCard, useStoreStatusOpenModal } from '@/store'
import { ICard, IColumn, IMember } from '@/types'
import { Avatar, Button, Popover, PopoverContent, PopoverTrigger, Textarea } from '@nextui-org/react'
import 'highlight.js/styles/github.css' // Or any other Highlight.js theme
import { Add, Card as CardIcon, Edit, MessageText, Send2, TextalignLeft, TickCircle } from 'iconsax-react'
import Link from 'next/link'
import { RefObject, useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import { cloneDeep } from 'lodash'

type ModalOpenCardDetailProps = {
  isOpenModalDetailCard: boolean
  setIsOpenModalDetailCard: (value: boolean) => void
}

const fakeData = {
  title: 'khang dep trai',
  comments: [
    {
      id: 1,
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
      createdAt: '12/12/2022',
      user: {
        name: 'Khang',
        picture: 'https://picsum.photos/200/300'
      }
    },
    {
      id: 2,
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
      createdAt: '12/12/2022',
      user: {
        name: 'Khang',
        picture: 'https://picsum.photos/200/300'
      }
    }
  ],
  assignMembers: [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'https://picsum.photos/200/300'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      picture: 'https://picsum.photos/200/300'
    },
    {
      _id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      picture: 'https://picsum.photos/200/300'
    },
    {
      _id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      picture: 'https://picsum.photos/200/300'
    },
    {
      _id: '5',
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      picture: 'https://picsum.photos/200/300'
    },
    {
      _id: '6',
      name: 'Eva Miller',
      email: 'eva@example.com',
      picture: 'https://picsum.photos/200/300'
    }
  ] as IMember[],
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'
}

// board member
const fakeAssignMembers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    picture: 'https://picsum.photos/200/300'
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    picture: 'https://picsum.photos/200/300'
  },
  {
    _id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    picture: 'https://picsum.photos/200/300'
  },
  {
    _id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    picture: 'https://picsum.photos/200/300'
  },
  {
    _id: '5',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    picture: 'https://picsum.photos/200/300'
  },
  {
    _id: '6',
    name: 'Eva Miller',
    email: 'eva@example.com',
    picture: 'https://picsum.photos/200/300'
  },
  {
    _id: '7',
    name: 'Frank Johnson',
    picture: 'https://picsum.photos/200/300',
    email: 'frank@example.com'
  },
  {
    _id: '8',
    name: 'Grace Lee',
    picture: 'https://picsum.photos/200/300',
    email: 'grace@example.com'
  },
  {
    _id: '9',
    name: 'Henry Clark',
    picture: 'https://picsum.photos/200/300',
    email: 'henry@example.com'
  },
  {
    _id: '10',
    name: 'Ivy Zhang',
    picture: 'https://picsum.photos/200/300',
    email: 'ivy@example.com'
  }
]

const ModalOpenCardDetail = ({ isOpenModalDetailCard, setIsOpenModalDetailCard }: ModalOpenCardDetailProps) => {
  const { currentCard, storeCurrentCard } = useStoreCard()

  const { board, storeBoard } = useStoreBoard()
  const { storeStatusOpenModal } = useStoreStatusOpenModal()
  const [cardDescription, setCardDescription] = useState(currentCard?.description || '')
  const [comment, setComment] = useState('')
  const [listComments, setListComments] = useState(currentCard?.comments || [])
  const [isOpenEditDescription, setIsOpenEditDescription] = useState(false)
  const [isOpenPopoverAssignMember, setIsOpenPopoverAssignMember] = useState(false)
  const [assignMembers, setAssignMembers] = useState(currentCard?.assignMembers || [])
  const textareaCommentRef: any = useRef<RefObject<HTMLAreaElement>>(null)

  const handleCloseModal = () => {
    setIsOpenModalDetailCard(false)
    storeStatusOpenModal(false)
    storeCurrentCard({} as any)
  }

  const handleAssignMember = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpenPopoverAssignMember(true)
  }

  const handleToggleAssignMember = async (member: IMember) => {
    try {
      console.log({ member })
      const cloneBoard: any = cloneDeep(board)

      const updateCard = (cardItem: ICard) => {
        if (cardItem._id === currentCard?._id) {
          const newAssignMembers = cardItem.assignMembers || []
          if (newAssignMembers.some((m) => m.email === member.email)) {
            return { ...cardItem, assignMembers: newAssignMembers.filter((m) => m.email !== member.email) }
          } else {
            return { ...cardItem, assignMembers: [...newAssignMembers, member] }
          }
        }
        return cardItem
      }

      cloneBoard.cards = cloneBoard.cards.map(updateCard)

      const currentColumn = cloneBoard.columns.find((columnItem: IColumn) => columnItem._id === currentCard?.columnId)
      if (currentColumn) {
        currentColumn.cards = currentColumn.cards.map(updateCard)
      }

      storeBoard(cloneBoard)
      await instance.put(`/v1/cards/${currentCard?._id}/detail`, {
        assignMembers: currentCard?.assignMembers?.some((m) => m.email === member.email)
          ? currentCard.assignMembers.filter((m) => m.email !== member.email)
          : [...(currentCard?.assignMembers || []), member]
      })

      setAssignMembers((prev) => (prev.some((m) => m.email === member.email) ? prev.filter((m) => m.email !== member.email) : [...prev, member]))
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditDescription = () => {
    setIsOpenEditDescription(true)
  }

  const handleSaveDescription = async () => {
    try {
      // storeBoard(currentCardInColumn)

      setIsOpenEditDescription(false)
      await handleEditCardDetail({
        description: cardDescription
      })

      Toast({
        type: 'success',
        message: 'Edit description success'
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSendComment = () => {
    console.log('handle send comment')
    setComment('')
  }
  const handleEditCardDetail = async (data: any) => {
    try {
      const cloneBoard: any = cloneDeep(board)

      // Update card in both board cards and column cards with a single map function
      const updateCard = (cardItem: ICard) => {
        if (cardItem._id === currentCard?._id) {
          return { ...cardItem, description: data.description }
        }
        return cardItem
      }

      cloneBoard.cards = cloneBoard.cards.map(updateCard)

      const currentColumn = cloneBoard.columns.find((columnItem: IColumn) => columnItem._id === currentCard?.columnId)
      if (currentColumn) {
        currentColumn.cards = currentColumn.cards.map(updateCard)
      }

      storeBoard(cloneBoard)
      await instance.put(`/v1/cards/${currentCard?._id}/detail`, data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentCard) {
      setCardDescription(currentCard?.description || '')
      setAssignMembers(currentCard?.assignMembers || [])
      setListComments(currentCard?.comments || [])
    }
  }, [currentCard])

  console.log({ assignMembers })
  if (!currentCard) return null

  return (
    <Modal
      size='4xl'
      isOpen={isOpenModalDetailCard}
      onOpenChange={isOpenPopoverAssignMember ? () => {} : handleCloseModal}
      modalTitle={
        <div className='flex items-center gap-2'>
          <CardIcon className='size-6' />
          <p>{currentCard?.title}</p>
        </div>
      }
    >
      <div className='flex max-h-[70dvh] flex-col gap-4 overflow-y-auto'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 font-bold'>
              <TextalignLeft />
              <p>Description</p>
            </div>
            {!isOpenEditDescription && (
              <Button
                onClick={handleEditDescription}
                startContent={<Edit className='size-5' />}
                className='max-h-10 min-h-10 rounded-md bg-blue-500 px-4 text-sm font-medium text-white'
              >
                Edit
              </Button>
            )}
          </div>
          {isOpenEditDescription && (
            <div className='flex flex-col gap-2'>
              <div className='grid grid-cols-2 gap-2'>
                <Textarea minRows={3} value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} />
                <Markdown className='whitespace-pre-wrap' rehypePlugins={[rehypeHighlight]}>
                  {cardDescription}
                </Markdown>
              </div>
              <Button onClick={handleSaveDescription} className='ml-auto max-h-10 min-h-10 w-fit rounded-md bg-blue-500 px-4 text-sm font-medium text-white'>
                Save
              </Button>
            </div>
          )}
          {cardDescription.length > 0 && !isOpenEditDescription && (
            <Markdown className='whitespace-pre-wrap' rehypePlugins={[rehypeHighlight]}>
              {cardDescription}
            </Markdown>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-sm font-medium text-blue-500'>Members</p>
          <div className='flex flex-wrap gap-1'>
            {assignMembers?.map((member) => (
              <div key={member.email} className='relative !size-10 max-h-10 min-h-10 min-w-10 max-w-10 rounded-full'>
                <Avatar src={member?.picture} className='size-full object-cover' />
                <div className='absolute bottom-0 right-0 rounded-full bg-white'>
                  <TickCircle size={16} variant='Bold' className='text-green-500' />
                </div>
              </div>
            ))}

            <Popover placement='right' isOpen={isOpenPopoverAssignMember} onOpenChange={setIsOpenPopoverAssignMember}>
              <PopoverTrigger>
                <Button isIconOnly className='!size-10 max-h-10 min-h-10 min-w-10 max-w-10 rounded-full bg-[#eee]' onClick={(e) => handleAssignMember(e)}>
                  <Add />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='grid grid-cols-5 gap-2'>
                  {board?.memberGmails?.map((member) => (
                    <div
                      onClick={() => handleToggleAssignMember(member)}
                      key={member.email}
                      className='relative !size-10 max-h-10 min-h-10 min-w-10 max-w-10 rounded-full'
                    >
                      <Avatar src={member?.picture} className='size-full object-cover' />
                      {assignMembers.some((m) => m.email === member.email) && (
                        <div className='absolute bottom-0 right-0 rounded-full bg-white'>
                          <TickCircle size={16} variant='Bold' className='text-green-500' />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className='flex items-center gap-2 font-bold'>
          <MessageText />
          <p>Comments</p>
        </div>
        {/* list comments */}
        <div className='flex flex-col gap-2'>
          <div className='flex max-h-[260px] flex-col gap-2 overflow-y-auto'>
            {listComments.length > 0
              ? listComments.map((item, index) => (
                  <div key={index} className='flex items-start gap-2'>
                    <div className='!size-10'>
                      <Avatar className='size-full rounded-full' src={item?.picture || ''} />
                    </div>
                    <div className='flex flex-col rounded-lg bg-[#f6f3f3] p-2'>
                      <div className='flex items-center gap-2'>
                        <Link href={'#'} className='text-sm font-bold'>
                          {item?.name}
                        </Link>
                        <time className='text-xs text-[#9c9c9c]'>{item?.createdAt}</time>
                      </div>
                      <p className='text-sm'>{item?.content}</p>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className='flex items-start gap-2'>
            <Textarea
              ref={textareaCommentRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendComment()
                }
              }}
              minRows={1}
              placeholder='Write a comment...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button className='!size-10 max-h-10 min-h-10 rounded-full bg-[#eee] bg-transparent' isIconOnly>
              <Send2 className={`${comment.length > 0 ? 'text-blue-500' : 'text-[#9c9c9c]'} transition`} />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalOpenCardDetail
