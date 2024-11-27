import { BOARD_TYPE, NOTIFICATION_STATUS, NOTIFICATION_TYPES } from '@/constants'

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
  type: (typeof BOARD_TYPE)[keyof typeof BOARD_TYPE]
  ownerIds: string[]
  memberIds: string[]
  columnOrderIds: string[]
  columns: IColumn[]
  updateAt: Date | null
  _destroy: boolean
  slug: string
  createAt: Date
  memberGmails: IMember[]
  isStared: boolean
}

type IMember = {
  _id?: string
  picture?: string
  name?: string
  email: string
  type: (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]
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

type Invitation = {
  boardId: string
  boardTitle: string
  status: 'pending' | 'accepted' | 'declined'
}

export type TNotifications = {
  _id: string
  ownerId: string
  authorId: string
  actionId: string
  createdAt: string
  status: (typeof NOTIFICATION_STATUS)[keyof typeof NOTIFICATION_STATUS]
  type: 'invite'
  title: string
  invitation?: Invitation
}

export type TBoards = {
  _id: string
  title: string
  description: string
  isStared: boolean
}
