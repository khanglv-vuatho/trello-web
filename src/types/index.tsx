export type ICard = {
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

export type IColumn = {
  _id: string
  boardId: string
  title: string
  cardOrderIds: string[]
  cards: ICard[]
}

export type IBoard = {
  _id: string
  title: string
  description: string
  type: 'public' | 'private'
  ownerIds: string[]
  memberIds: string[]
  columnOrderIds: string[]
  columns: IColumn[]
  updateAt: Date | null
  _destroy: boolean
  slug: string
  createAt: Date
  memberGmails: IMember[]
}

type IMember = {
  _id: string
  email: string
  picture: string
  name: string
}

export type TUserInfo = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}
