import { ICard } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Attachment as AttachmentIcon, Comment as CommentIcon, Group as GroupIcon } from '@mui/icons-material'
import { Button, CardBody, Card as CardNextUI } from '@nextui-org/react'
import ImageFallback from '../ImageFallback'

const CardContent = ({ card }: { card: ICard }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card },
  })

  const dndKitCardStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '1px solid #54a0ff' : '',
  }

  const shouldShowCardAction = () => !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <CardNextUI className={`cursor-pointer rounded-lg `} style={dndKitCardStyle}>
        <CardBody className={`p-0 ${card?.FE_PlaceholderCard ? 'hidden' : 'block'}`}>
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
        </CardBody>
      </CardNextUI>
    </div>
  )
}

export default CardContent
