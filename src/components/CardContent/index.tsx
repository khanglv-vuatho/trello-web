import { IBoard, ICard, IColumn } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Attachment as AttachmentIcon, Comment as CommentIcon, Group as GroupIcon } from '@mui/icons-material'
import { Button, CardBody, Card as CardNextUI, useDisclosure } from '@nextui-org/react'
import ImageFallback from '../ImageFallback'
import { Trash } from 'iconsax-react'
import Modal from '@/components/Modal'
import instance from '@/services/axiosConfig'
import Toast from '../Toast'
import { useEffect, useState } from 'react'
import { useStoreBoard } from '@/store'

const CardContent = ({ card }: { card: ICard }) => {
  const [onDeletingCard, setOnDeletingCard] = useState(false)

  const { storeBoard } = useStoreBoard()

  const board = useStoreBoard((state) => state.board)

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

  useEffect(() => {
    onDeletingCard && deleteCard()
  }, [onDeletingCard])

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <CardNextUI className={`cursor-pointer rounded-lg group`} style={dndKitCardStyle}>
        <CardBody className={`p-0 ${card?.FE_PlaceholderCard ? 'hidden' : 'block'}`}>
          <div className='flex items-center justify-between pr-1'>
            <div>
              {card?.cover && <ImageFallback alt={card?.cover} className='object-contain max-h-[200px] w-full' src={card?.cover} width={270} height={400} />}
              <p className='p-2 select-none'>{card?.title}</p>
              {shouldShowCardAction() && (
                <div className='flex items-center gap-2 p-2'>
                  {!!card?.memberIds?.length && (
                    <Button variant='light' startContent={<GroupIcon className='size-5' />} className='flex gap-2 items-center text-colorHeader rounded-sm'>
                      {card?.memberIds?.length}
                    </Button>
                  )}
                  {!!card?.comments?.length && (
                    <Button variant='light' startContent={<CommentIcon className='size-5' />} className='flex gap-2 items-center text-colorHeader rounded-sm'>
                      {card?.comments?.length}
                    </Button>
                  )}
                  {!!card?.attachments?.length && (
                    <Button variant='light' startContent={<AttachmentIcon className='size-5' />} className='flex gap-2 items-center text-colorHeader rounded-sm'>
                      {card?.attachments?.length}
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div onClick={() => onOpen()}>
              <Trash className='hidden group-hover:block hover:text-red-500 duration-150' size={20} />
            </div>
          </div>
        </CardBody>
      </CardNextUI>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modalTitle='Delete Card'
        modalBody='Are you sure you want to delete this card?'
        modalFooter={
          <div className='flex items-center gap-2'>
            <Button isLoading={onDeletingCard} variant='light' color='danger' onClick={() => handleDeleteCard()} className='py-3 px-6'>
              Delete
            </Button>
            <Button onClick={onOpenChange} className='bg-colorBoardContent text-white py-3 px-6'>
              Cancel
            </Button>
          </div>
        }
      />
    </div>
  )
}

export default CardContent
