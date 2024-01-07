'use client'

import {
  Add as AddIcon,
  DragHandle as DragHandleIcon,
  MoreHoriz as MoreHorizIcon,
  Group as GroupIcon,
  Comment as CommentIcon,
  Attachment as AttachmentIcon,
} from '@mui/icons-material'
import { Button, Card as CardNextUI, CardBody } from '@nextui-org/react'
import ExpandButton from '../ExpandButton'
import { Board, Card, Column } from '@/interface'
import ImageFallback from '../ImageFallback'
import { mapOrder } from '@/utils'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useMemo, useState } from 'react'

function BoardContent({ board }: { board: Board }) {
  const [orderedColumns, setOrderedColumns] = useState<any[]>([])

  const mouseSensor = useSensor(PointerSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  })
  const touchSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 500,
    },
  })

  //conver sensors before passing to DndContext
  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const _handleDragEnd = (e: any) => {
    console.log('_handleDragEnd', e)
    const { active, over } = e

    // check exits over
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex((item) => active.id === item._id)
      const newIndex = orderedColumns.findIndex((item) => over.id === item._id)

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      //array index after dragend
      // const dndOrderedColumnsIds = dndOrderedColumns.map((item) => item._id)

      setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <div className='bg-colorBoardContent h-boardContent'>
      <DndContext onDragEnd={_handleDragEnd} sensors={sensors}>
        <ListColumn columns={orderedColumns} />
      </DndContext>
    </div>
  )
}

const ListColumn = ({ columns }: { columns: Column[] }) => {
  const columnsDndKit = useMemo(() => columns.map((item) => item._id), [columns])

  return (
    <SortableContext strategy={horizontalListSortingStrategy} items={columnsDndKit}>
      <div className='flex gap-4 p-2'>
        {columns.map((column) => (
          <Column key={column._id} column={column} />
        ))}
      </div>
    </SortableContext>
  )
}
const Column = ({ column }: { column: Column }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column._id,
    data: { ...column },
  })

  const dndKitColumnStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
  }
  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyle}
      {...attributes}
      {...listeners}
      className='rounded-lg bg-[#f1f2f4] w-full max-w-[300px] p-2 h-[fit-content]'
    >
      <div className='flex items-center justify-between'>
        <h3 className='pl-3 font-semibold'>{column?.title}</h3>
        <ExpandButton isIconOnly content={<>Expand ...</>}>
          <MoreHorizIcon className='text-black' />
        </ExpandButton>
      </div>
      <ListCard cards={orderedCards} />
      <div className='flex items-center'>
        <Button
          startContent={<AddIcon className='text-[#091E42]' />}
          className='rounded-lg w-full justify-start p-2 bg-transparent hover:bg-[#091E4224]'
        >
          Add a card
        </Button>
        <ExpandButton isIconOnly content={<>DragHandleIcon ...</>}>
          <DragHandleIcon className='text-black' />
        </ExpandButton>
      </div>
    </div>
  )
}

const ListCard = ({ cards }: { cards: Card[] }) => {
  return (
    <div className='flex flex-col gap-2 py-2'>
      {cards.map((card) => (
        <CardContent key={card._id} card={card} />
      ))}
    </div>
  )
}

const CardContent = ({ card }: { card: Card }) => {
  const shouldShowCardAction = () => {
    return (
      !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
    )
  }
  return (
    <CardNextUI className='rounded-lg'>
      <CardBody className='p-0'>
        {card?.cover && (
          <ImageFallback
            alt={card?.cover}
            className='object-contain max-h-[200px] w-full'
            src={card?.cover}
            width={270}
            height={400}
          />
        )}
        <p className='p-2'>{card?.title}</p>
        {shouldShowCardAction() && (
          <div className='flex items-center gap-2 p-2'>
            {!!card?.memberIds?.length && (
              <Button
                variant='light'
                startContent={<GroupIcon className='size-5' />}
                className='flex gap-2 items-center text-colorHeader rounded-sm'
              >
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button
                variant='light'
                startContent={<CommentIcon className='size-5' />}
                className='flex gap-2 items-center text-colorHeader rounded-sm'
              >
                {card?.comments?.length}
              </Button>
            )}
            {!!card?.attachments?.length && (
              <Button
                variant='light'
                startContent={<AttachmentIcon className='size-5' />}
                className='flex gap-2 items-center text-colorHeader rounded-sm'
              >
                {card?.attachments?.length}
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </CardNextUI>
  )
}

export default BoardContent
