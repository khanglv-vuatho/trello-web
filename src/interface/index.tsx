export interface ICard {
  _id: string
  boardId: string
  columnId: string
  title: string
  description: string | null
  cover: string | null
  memberIds: string[]
  comments: string[]
  attachments: string[]
  FE_PlaceholderCard?: boolean
}

export interface IColumn {
  _id: string
  boardId: string
  title: string
  cardOrderIds: string[]
  cards: ICard[]
}

export interface IBoard {
  _id: string
  title: string
  description: string
  type: 'public' | 'private'
  ownerIds: string[]
  memberIds: string[]
  columnOrderIds: string[]
  columns: IColumn[]
}
