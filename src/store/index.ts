import instance from '@/services/axiosConfig'
import { IBoard, IColumn, TUserInfo } from '@/types'
import { create } from 'zustand'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard, mapOrder } from '@/utils'

type TBoardState = {
  board?: IBoard
  storeBoard: (board: IBoard) => void
  fetchBoardDetail: (boardId: string, email: string) => Promise<IBoard>
  createNewColumn: (board: IBoard, title: string) => Promise<void>
  createNewCard: (column: IColumn, board: IBoard, title: string) => Promise<void>
  moveColumn: (column: IColumn, board: IBoard, title: string) => Promise<void>
  starBoard: (boardId: string, isStared: boolean) => Promise<void>
  fetchAllBoards: (email: string) => Promise<void>
  deleteBoard: (boardId: string) => Promise<void>
}

export const useStoreBoard = create<TBoardState>((set, get) => ({
  storeBoard: (board) => {
    set({ board })
  },

  fetchAllBoards: async (email) => {
    try {
      const data: any = await instance.get(`/v1/boards/get-all?email=${email}`)
      set({ board: data })
      return data
    } catch (error) {
      console.log(error)
    }
  },

  fetchBoardDetail: async (boardId, email) => {
    try {
      const data: any = await instance.get(`/v1/boards/${boardId}?email=${email}`)
      const cloneData = { ...data }

      cloneData.columns = mapOrder(cloneData?.columns, cloneData?.columnOrderIds, '_id')

      cloneData?.columns?.forEach((column: any) => {
        if (column.cards.length === 0) {
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

  deleteBoard: async (boardId) => {
    await instance.delete(`/v1/boards/${boardId}`)
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
    const clonedColumn = { ...column }

    const newBoard = { ...board, columns: board?.columns.map((col) => (col?._id === column?._id ? clonedColumn : col)) }

    set({ board: newBoard })

    const payload = {
      title,
      boardId: board?._id,
      columnId: column?._id,
    }
    const card: any = await instance.post('/v1/cards', payload)

    clonedColumn.cards.push(card)
    clonedColumn.cardOrderIds.push(card?._id)
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

    set({ board: newBoard })
  },

  starBoard: async (boardId, isStared) => {
    await instance.put('/v1/boards/' + boardId, { isStared })
    const board = get().board

    if (!board) return
    const newBoard = { ...board, isStared }
  },
}))

type TUserState = {
  userInfo?: TUserInfo
  storeUser: (user: TUserInfo) => void
}

export const useStoreUser = create<TUserState>((set) => ({
  storeUser: (userInfo) => {
    set({ userInfo })
  },
}))
