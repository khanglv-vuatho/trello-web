import instance from '@/services/axiosConfig'
import { IBoard, IColumn } from '@/types'
import { create } from 'zustand'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard, mapOrder } from '@/utils'

type TBoardState = {
  board?: IBoard
  storeBoard: (board: IBoard) => Promise<void>
  fetchBoard: (boardId: string) => Promise<IBoard>
  createNewColumn: (board: IBoard, title: string) => Promise<void>
  createNewCard: (column: IColumn, board: IBoard, title: string) => Promise<void>
  moveColumn: (column: IColumn, board: IBoard, title: string) => Promise<void>
}

export const useStoreBoard = create<TBoardState>((set, get) => ({
  storeBoard: async (board) => {
    set({ board })
  },
  fetchBoard: async (boardId) => {
    try {
      const data: any = await instance.get(`/v1/boards/${boardId}`)
      const cloneData = { ...data }

      cloneData.columns = mapOrder(cloneData?.columns, cloneData?.columnOrderIds, '_id')

      cloneData?.columns?.forEach((column: any) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })

      set({ board: { ...cloneData } })
      return cloneData
    } catch (error) {
      console.log(error)
    }
  },
  createNewColumn: async (board, title) => {
    try {
      const payload = {
        boardId: board?._id,
        title,
      }
      const column: any = await instance.post('/v1/columns', payload)
      const cloneColumn = { ...column }

      if (isEmpty(cloneColumn.cards)) {
        cloneColumn.cards = [generatePlaceholderCard(cloneColumn)]
        cloneColumn.cardOrderIds = [generatePlaceholderCard(cloneColumn)._id]
      }

      const newBoard = { ...board, columns: [...board?.columns, cloneColumn], columnOrderIds: [...board?.columnOrderIds, cloneColumn?._id] }
      set({ board: newBoard })
    } catch (error) {
      console.log(error)
    }
  },
  createNewCard: async (column, board, title) => {
    const payload = {
      title,
      boardId: board?._id,
      columnId: column?._id,
    }
    const card: any = await instance.post('/v1/cards', payload)

    const clonedColumn = { ...column }
    clonedColumn.cards.push(card)
    clonedColumn.cardOrderIds.push(card?._id)

    const newBoard = { ...board, columns: board?.columns.map((col) => (col?._id === column?._id ? clonedColumn : col)) }

    console.log(newBoard)
    set({ board: newBoard })
  },
  moveColumn: async (column, board, title) => {
    const payload = {
      title,
      boardId: board?._id,
      columnId: column?._id,
    }
    const card: any = await instance.post('/v1/cards', payload)

    const clonedColumn = { ...column }
    clonedColumn.cards.push(card)
    clonedColumn.cardOrderIds.push(card?._id)

    const newBoard = { ...board, columns: board?.columns.map((col) => (col?._id === column?._id ? clonedColumn : col)) }

    console.log(newBoard)
    set({ board: newBoard })
  },
}))
