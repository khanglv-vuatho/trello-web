'use client'

import {
  DndContext,
  DragOverlay,
  DropAnimation,
  PointerSensor,
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

import { generatePlaceholderCard, mapOrder } from '@/utils'
import ExpandButton from '../ExpandButton'

import CardContent from '@/components/CardContent'
import CreateCard from '@/components/CreateCard'
import CreateColumn from '@/components/CreateColumn'
import { IBoard, ICard, IColumn } from '@/types'

import './BoardContent.css'
import { isEmpty } from 'lodash'
import { useStoreBoard } from '@/store'
import instance from '@/services/axiosConfig'
import { ITEM_TYPE } from '@/constants'

type TBoardContent = { board: IBoard }
function BoardContent({ board }: TBoardContent) {
  const [orderedColumns, setOrderedColumns] = useState<any[]>([])

  const [activeDragItemId, setActiveDragItemId] = useState<any>(null)
  const [activeItemDragStart, setActiveItemDragStart] = useState<any>({})
  const [activeItemType, setActiveItemType] = useState<any>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<any>(null)
  const [oldCloumnWhenDraggingCard, setOldCloumnWhenDraggingCard] = useState<any>(null)

  const { storeBoard } = useStoreBoard()

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
        const pointerCollisions = pointerWithin(args)

        // Collision detection algorithms return an array of collisions
        if (pointerCollisions.length > 0) {
          return pointerCollisions
        }

        // If there are no collisions with the pointer, return rectangle intersections
        return rectIntersection(args)
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
      let newCardIndex: number

      //find index active over card
      const overCardIndex = overColumn?.cards?.findIndex((card: ICard) => card._id === overCardId)

      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      //clone orderedcolumn
      const nextColumns = JSON.parse(JSON.stringify(prevColumns))

      const nextActiveColumn = nextColumns.find((column: IColumn) => column?._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column: IColumn) => column?._id === overColumn._id)

      //nextActiveColumn is old Column
      if (nextActiveColumn) {
        //delete card active
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card: ICard) => card._id !== activeDraggingCardId)

        // add FE_PlaceholderCard if column is empty
        if (!nextActiveColumn?.cards?.length) {
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

        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // delete placeholder card if exits
        nextColumns.cards = nextOverColumn.cards.filter((card: any) => card?.FE_PlaceholderCard)

        //update cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card: ICard) => card._id)
      }

      return [...nextColumns]
    })
  }

  const moveColumn = async (dndOrderedColumns: IColumn[], board: IBoard) => {
    const cloneBoard = { ...board }
    const dndOrderedColumnsIds = dndOrderedColumns.map((item) => item._id)
    cloneBoard.columnOrderIds = dndOrderedColumnsIds
    cloneBoard.columns = dndOrderedColumns
    storeBoard(cloneBoard)

    try {
      await instance.put(`/v1/boards/${board._id}`, {
        columns: dndOrderedColumns,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const moveCardInTheSameColumn = async (dndOrderedCards: ICard[], dndOrderedCardsIds: string[], columnId: string) => {
    const cloneBoard = { ...board }

    const columnToUpdate = cloneBoard.columns.find((column: IColumn) => column?._id === columnId)

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }

    storeBoard(cloneBoard)

    try {
      await instance.put(`/v1/columns/${columnId}`, {
        cardOrderIds: dndOrderedCardsIds,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const _handleDragStart = (e: any) => {
    const { active } = e
    setActiveDragItemId(e?.active?.id)
    setActiveItemDragStart(active)
    setActiveItemType(!!active?.data?.current?.cards ? ITEM_TYPE.COLUMN : ITEM_TYPE.CARD)
    setActiveDragItemData(active?.data?.current)

    if (!active?.data?.current?.cardOrderIds) {
      setOldCloumnWhenDraggingCard(_handleFindColumnByCardId(e?.active?.id))
    }
  }

  const _handleDragOver = (e: any) => {
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
      if (oldCloumnWhenDraggingCard?._id !== overColumn?._id) {
        moveCardBetweenDifferenctColumns(overCardId, overColumn, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
      } else {
        const oldCardIndex = oldCloumnWhenDraggingCard?.cards?.findIndex((card: ICard) => card._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex((card: ICard) => card._id === overCardId)

        const dndOrderedCards: any = arrayMove(oldCloumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardsIds = dndOrderedCards.map((item: any) => item._id)

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardsIds, oldCloumnWhenDraggingCard)

        setOrderedColumns((prev) => {
          const nextColumns = JSON.parse(JSON.stringify(prev))

          const targetColumn = nextColumns.find((column: IColumn) => column._id === overColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardsIds

          return nextColumns
        })
      }
    }

    //drag and drop column action
    if (activeItemType === 'ACTIVE_ITEM_COLUMN') {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex((item) => item._id === active.id)
        const newColumnIndex = orderedColumns.findIndex((item) => item._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        //array index after dragend
        moveColumn(dndOrderedColumns, board)
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
  const [titleColumn, setTitleColumn] = useState<string>('')

  const columnsDndKit = columns.map((item) => item._id)
  return (
    <SortableContext strategy={horizontalListSortingStrategy} items={columnsDndKit}>
      <div className='flex gap-4 p-2'>
        {columns.map((column) => (
          <Column key={column._id} column={column} />
        ))}
        <CreateColumn value={titleColumn} setValue={setTitleColumn} />
      </div>
    </SortableContext>
  )
}
const Column = ({ column }: { column: IColumn }) => {
  const [orderedCards, setOrderedCards] = useState<any[]>([])
  const [cardTitle, setCardTitle] = useState<string>('')

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
    <div ref={setNodeRef} {...attributes} {...listeners} style={dndKitColumnStyle} className='max-w-[300px] min-w-[300px] '>
      <div className={`rounded-lg bg-[#f1f2f4] w-full h-[fit-content]`}>
        <div className='flex items-center justify-between p-2'>
          <h3 className='pl-3 font-semibold select-none'>{column?.title}</h3>
          <ExpandButton isIconOnly content={<>Expand ...</>}>
            <MoreHorizIcon className='text-black' />
          </ExpandButton>
        </div>
        <ListCard cards={orderedCards} />
        <CreateCard value={cardTitle} setValue={setCardTitle} column={column} />
      </div>
    </div>
  )
}

const ListCard = ({ cards }: { cards: ICard[] }) => {
  const dndKitCards = cards.map((item) => item._id)

  return (
    <SortableContext strategy={verticalListSortingStrategy} items={dndKitCards}>
      <div className='card'>
        <div className='flex flex-col gap-2 px-2'>{cards?.length ? cards.map((card, index) => <CardContent key={index} card={card} />) : <></>}</div>
      </div>
    </SortableContext>
  )
}

export default BoardContent
