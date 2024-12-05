import { ICard, IColumn } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Attachment as AttachmentIcon, Comment as CommentIcon, Group as GroupIcon } from '@mui/icons-material'
import { Button, CardBody, Card as CardNextUI, Input, useDisclosure } from '@nextui-org/react'
import ImageFallback from '@/components/ImageFallback'
import { Trash } from 'iconsax-react'
import Modal from '@/components/Modal'
import instance from '@/services/axiosConfig'
import Toast from '@/components/Toast'
import { useEffect, useState } from 'react'
import { useStoreBoard } from '@/store'
import { generatePlaceholderCard } from '@/utils'
import { useStoreStatusOpenModal } from '@/store'
import ModalDeleteCard from './ModalDeleteCard'
import ModalOpenCardDetail from './ModalOpenCardDetail'

const CardContent = ({ card }: { card: ICard }) => {
  const { storeBoard, board } = useStoreBoard()
  const { status, storeStatusOpenModal } = useStoreStatusOpenModal()
  const [onDeletingCard, setOnDeletingCard] = useState(false)

  const [onFixTitleCard, setOnFixTitleCard] = useState<boolean>(false)
  const [isOpenModalDetailCard, setIsOpenModalDetailCard] = useState<boolean>(false)
  const [valueTitleCard, setValueTitleCard] = useState<string>(card?.title)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card },
  })

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const dndKitCardStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '1px solid #54a0ff' : '',
  }

  const shouldShowCardAction = () => !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length

  const handleDeleteCard = () => {
    setOnDeletingCard(true)
  }

  const deleteCard = async () => {
    const payload = { cardId: card._id, columnId: card.columnId }

    try {
      const updatedBoard: any = { ...board }
      const columnIndex = updatedBoard.columns.findIndex((column: IColumn) => column._id === card.columnId)

      if (columnIndex !== -1) {
        const column = updatedBoard.columns[columnIndex]

        const cardIndex = column.cards.findIndex((item: ICard) => item._id === card._id)
        column.cards.splice(cardIndex, 1)
        column.cardOrderIds.splice(cardIndex, 1)

        if (!column?.cards?.length) {
          column.cards = [generatePlaceholderCard(column)]
        }

        await instance.delete('/v1/cards/delete', { data: payload })
        Toast({ message: 'Card deleted successfully', type: 'success' })

        storeBoard(updatedBoard)
      } else {
        Toast({ message: 'Column not found', type: 'error' })
      }
    } catch {
      Toast({ message: 'Failed to delete card', type: 'error' })
    } finally {
      setOnDeletingCard(false)
      onClose()
    }
  }

  const handleRenameCard = async () => {
    if (valueTitleCard === card?.title || valueTitleCard === '') return setOnFixTitleCard(false)

    if (valueTitleCard?.length <= 3 || valueTitleCard?.length > 50) {
      Toast({ message: 'Card name must be at least 4 and max 50 characters', type: 'error' })
      return setOnFixTitleCard(false)
    }

    const payload = { columnId: card.columnId, title: valueTitleCard }

    try {
      const updatedBoard: any = { ...board }
      const columnIndex = updatedBoard.columns.findIndex((column: IColumn) => column._id === card.columnId)

      if (columnIndex !== -1) {
        const column = updatedBoard.columns[columnIndex]
        const cardIndex = column.cards.findIndex((item: ICard) => item._id === card._id)
        console.log({ valueTitleCard })
        console.log({ titleOld: column.cards[cardIndex].title })
        column.cards[cardIndex].title = valueTitleCard
      }
      storeBoard(updatedBoard)

      await instance.put(`/v1/cards/rename/${card._id}`, payload)
      Toast({ message: 'Card renamed successfully', type: 'success' })
    } catch {
      Toast({ message: 'Failed to rename card', type: 'error' })
    } finally {
      setOnFixTitleCard(false)
    }
  }

  const handleOpenModalDetailCard = () => {
    setIsOpenModalDetailCard(true)
    storeStatusOpenModal(true)
  }

  useEffect(() => {
    onDeletingCard && deleteCard()
  }, [onDeletingCard])

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <CardNextUI className={`group cursor-pointer rounded-lg`} style={dndKitCardStyle}>
        <CardBody className={`p-0 ${card?.FE_PlaceholderCard ? 'hidden' : 'block'}`}>
          <div onClick={handleOpenModalDetailCard} className='flex w-full items-center justify-between pr-1'>
            <div className='w-[90%]'>
              {card?.cover && <ImageFallback alt={card?.cover} className='max-h-[200px] w-full object-contain' src={card?.cover} width={270} height={400} />}
              {onFixTitleCard ? (
                <Input
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameCard()
                    }
                  }}
                  variant='bordered'
                  autoFocus
                  onBlur={handleRenameCard}
                  defaultValue={card?.title}
                  value={valueTitleCard}
                  onChange={(e) => {
                    setValueTitleCard(e.target.value)
                  }}
                  className='w-full'
                />
              ) : (
                <p className='select-none p-2' onDoubleClick={() => setOnFixTitleCard(!onFixTitleCard)}>
                  {card?.title}
                </p>
              )}
              {shouldShowCardAction() && (
                <div className='flex items-center gap-2 p-2'>
                  {!!card?.memberIds?.length && (
                    <Button variant='light' startContent={<GroupIcon className='size-5' />} className='flex items-center gap-2 rounded-sm text-colorHeader'>
                      {card?.memberIds?.length}
                    </Button>
                  )}
                  {!!card?.comments?.length && (
                    <Button variant='light' startContent={<CommentIcon className='size-5' />} className='flex items-center gap-2 rounded-sm text-colorHeader'>
                      {card?.comments?.length}
                    </Button>
                  )}
                  {!!card?.attachments?.length && (
                    <Button variant='light' startContent={<AttachmentIcon className='size-5' />} className='flex items-center gap-2 rounded-sm text-colorHeader'>
                      {card?.attachments?.length}
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div
              onClick={(e) => {
                onOpen()
                e.stopPropagation()
                e.preventDefault()
              }}
              className='z-20 cursor-pointer'
            >
              <Trash className='hidden duration-150 hover:text-red-500 group-hover:block' size={20} />
            </div>
          </div>
        </CardBody>
      </CardNextUI>
      <ModalDeleteCard isOpen={isOpen} onOpenChange={onOpenChange} onDeletingCard={onDeletingCard} handleDeleteCard={handleDeleteCard} />
      <ModalOpenCardDetail isOpenModalDetailCard={isOpenModalDetailCard} setIsOpenModalDetailCard={setIsOpenModalDetailCard} card={card} />
    </div>
  )
}

export default CardContent
