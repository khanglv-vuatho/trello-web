'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DropAnimation,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Add as AddIcon, DragHandle as DragHandleIcon, MoreHoriz as MoreHorizIcon, Group as GroupIcon, Comment as CommentIcon, Attachment as AttachmentIcon } from '@mui/icons-material'
import { Button, Card as CardNextUI, CardBody } from '@nextui-org/react'

import ExpandButton from '../ExpandButton'
import ImageFallback from '../ImageFallback'
import { generatePlaceholderCard, mapOrder } from '@/utils'

import './BoardContent.css'
import { IBoard, ICard, IColumn } from '@/interface'

const ITEM_TYPE = {
  CARD: 'ACTIVE_ITEM_CARD',
  COLUMN: 'ACTIVE_ITEM_COLUMN',
}

function BoardContent({ board }: { board: IBoard }) {
  const [orderedColumns, setOrderedColumns] = useState<any[]>([])

  const [activeDragItemId, setActiveDragItemId] = useState<any>(null)
  const [activeItemDragStart, setActiveItemDragStart] = useState<any>({})
  const [activeItemType, setActiveItemType] = useState<any>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<any>(null)
  const [oldCloumnWhenDraggingCard, setOldCloumnWhenDraggingCard] = useState<any>(null)

  const mouseSensor = useSensor(PointerSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  })

  const touchSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  })

  //conver sensors before passing to DndContext
  const sensors = useSensors(mouseSensor, touchSensor)

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  }

  const lastOverId = useRef<any>(null)

  const collisionDetectionStrategy = useCallback(
    (args: any) => {
      if (activeItemType === 'ACTIVE_ITEM_COLUMN') {
        return closestCorners({ ...args })
      }

      const pointerIntersections = pointerWithin(args)

      if (!pointerIntersections?.length) return

      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        const checkColumn = orderedColumns.find((column) => column._id == overId)

        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args?.droppableContainers.filter((container: any) => {
              return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            }),
          })?.[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeItemType, orderedColumns],
  )

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const _handleFindColumnByCardId = (id: string | number) => {
    return orderedColumns?.find((column) => column?.cards?.map((card: ICard) => card._id)?.includes(id))
  }

  const moveCardBetweenDifferenctColumns = (overCardId: any, overColumn: any, active: any, over: any, activeColumn: any, activeDraggingCardId: any, activeDraggingCardData: any) => {
    setOrderedColumns((prevColumns) => {
      console.log('prevColumns', prevColumns)

      let newCardIndex: number

      //find index active over card
      const overCardIndex = overColumn?.cards?.findIndex((card: ICard) => card._id === overCardId)

      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      //clone orderedcolumn
      const nextColumns = JSON.parse(JSON.stringify(prevColumns))
      console.log('nextColumns', nextColumns)

      const nextActiveColumn = nextColumns.find((column: IColumn) => column?._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column: IColumn) => column?._id === overColumn._id)

      console.log('nextActiveColumn', nextActiveColumn)
      console.log('nextOverColumn', nextOverColumn)

      //nextActiveColumn is old Column
      if (nextActiveColumn) {
        //delete card active
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card: ICard) => card._id !== activeDraggingCardId)

        // add FE_PlaceholderCard if column is empty
        if (!nextActiveColumn?.cards?.length) {
          console.log('card cuoi cung bi keo di')

          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        //arrange cardOrderIds of Column
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card: ICard) => card._id)
      }

      //nextOverColumn is new Column
      if (nextOverColumn) {
        //check exits overcolumn, and delete
        nextOverColumn.cards = nextOverColumn.cards.filter((card: ICard) => card?._id !== activeDraggingCardId)
        //add cardover to overColumn follow new index (newCardIndex)

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn?._id,
        }
        console.log(' nextColumns.cards', nextColumns.cards)

        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // delete placeholder card if exits
        nextColumns.cards = nextOverColumn.cards.filter((card: any) => card?.FE_PlaceholderCard)

        //update cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card: ICard) => card._id)
      }

      console.log('nextColumns', nextColumns)

      return [...nextColumns]
    })
  }

  const _handleDragStart = (e: any) => {
    const { active } = e
    setActiveDragItemId(e?.active?.id)
    setActiveItemDragStart(active)
    setActiveItemType(active?.data?.current?._id?.includes('column') ? ITEM_TYPE.COLUMN : ITEM_TYPE.CARD)
    setActiveDragItemData(active?.data?.current)
    if (active?.data?.current?._id?.includes('card')) {
      setOldCloumnWhenDraggingCard(_handleFindColumnByCardId(e?.active?.id))
    }
  }

  const _handleDragOver = (e: any) => {
    // console.log('_handleDragOver', e)

    if (activeItemType === 'ACTIVE_ITEM_COLUMN') return

    const { active, over } = e
    if (!active || !over) return

    //activeDraggingCardId is card dragging
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active
    const { id: overCardId } = over

    const activeColumn = _handleFindColumnByCardId(active?.id)
    const overColumn = _handleFindColumnByCardId(over?.id)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferenctColumns(overCardId, overColumn, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
    }
  }

  const _handleDragEnd = (e: any) => {
    // console.log('_handleDragEnd', e)

    const { active, over } = e

    // check exits over
    if (!active || !over) return
    //drag and drop card action
    if (activeItemType === 'ACTIVE_ITEM_CARD') {
      //activeDraggingCardId is card dragging
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active
      const { id: overCardId } = over

      const activeColumn = _handleFindColumnByCardId(active?.id)
      const overColumn = _handleFindColumnByCardId(over?.id)

      if (!activeColumn || !overColumn) return

      //drag and drop between 2 difference column
      if (oldCloumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferenctColumns(overCardId, overColumn, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
      } else {
        const oldCardIndex = oldCloumnWhenDraggingCard?.cards?.findIndex((card: ICard) => card._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex((card: ICard) => card._id === overCardId)

        const dndOrderedCards = arrayMove(oldCloumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns((prev) => {
          const nextColumns = JSON.parse(JSON.stringify(prev))

          const targetColumn = nextColumns.find((column: IColumn) => column._id === overColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map((card: any) => card._id)

          return nextColumns
        })
      }
    }

    //drag and drop column action
    if (activeItemType === 'ACTIVE_ITEM_COLUMN') {
      console.log('123222')

      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex((item) => item._id === active.id)
        const newColumnIndex = orderedColumns.findIndex((item) => item._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        //array index after dragend
        // const dndOrderedColumnsIds = dndOrderedColumns.map((item) => item._id)

        //update state
        setOrderedColumns(dndOrderedColumns)
      }
    }

    //reset data
    setActiveItemDragStart(null)
    setActiveItemType(null)
    setActiveDragItemId(null)
    setOldCloumnWhenDraggingCard(null)
    setActiveDragItemData(null)
  }

  return (
    <div className='bg-colorBoardContent h-boardContent overflow-x-auto'>
      <DndContext collisionDetection={collisionDetectionStrategy as any} onDragStart={_handleDragStart} onDragEnd={_handleDragEnd} sensors={sensors} onDragOver={_handleDragOver}>
        <ListColumn columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {activeItemDragStart?.id && activeItemType === 'ACTIVE_ITEM_COLUMN' ? <Column column={activeDragItemData} /> : <CardContent card={activeDragItemData} />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

const ListColumn = ({ columns }: { columns: IColumn[] }) => {
  // console.log('ListColumn', columns.length)

  const columnsDndKit = columns.map((item) => item._id)
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
const Column = ({ column }: { column: IColumn }) => {
  // console.log('column', column)

  const [orderedCards, setOrderedCards] = useState<any[]>([])

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column },
  })

  const dndKitColumnStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.7 : 1,
  }

  useEffect(() => {
    setOrderedCards(mapOrder(column?.cards, column?.cardOrderIds, '_id'))
  }, [column])

  return (
    <div style={dndKitColumnStyle} className='max-w-[300px] min-w-[300px]'>
      <div className={`rounded-lg bg-[#f1f2f4] w-full h-[fit-content]`}>
        <div ref={setNodeRef} {...attributes} {...listeners} className='flex items-center justify-between p-2'>
          <h3 className='pl-3 font-semibold'>{column?.title}</h3>
          <ExpandButton isIconOnly content={<>Expand ...</>}>
            <MoreHorizIcon className='text-black' />
          </ExpandButton>
        </div>
        <ListCard cards={orderedCards} />
        <div className='flex items-center p-2'>
          <Button startContent={<AddIcon className='text-[#091E42]' />} className='rounded-lg w-full justify-start p-2 bg-transparent hover:bg-[#091E4224]'>
            Add a card
          </Button>
          <ExpandButton isIconOnly content={<>DragHandleIcon ...</>}>
            <DragHandleIcon className='text-black' />
          </ExpandButton>
        </div>
      </div>
    </div>
  )
}

const ListCard = ({ cards }: { cards: ICard[] }) => {
  // console.log('cards', cards)

  const dndKitCards = cards.map((item) => item._id)

  return (
    <SortableContext strategy={verticalListSortingStrategy} items={dndKitCards}>
      <div className='card'>
        <div className='flex flex-col gap-2 px-2'>
          {cards.map((card, index) => (
            <CardContent key={index} card={card} />
          ))}
        </div>
      </div>
    </SortableContext>
  )
}

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
        <CardBody className={`p-0 ${card?.FE_PlaceholderCard ? 'none' : 'block'}`}>
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

export default BoardContent
