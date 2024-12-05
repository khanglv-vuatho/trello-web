const createEnum = <T extends Record<string, string>>(obj: T) => Object.freeze(obj)

export const ITEM_TYPE = createEnum({
  CARD: 'ACTIVE_ITEM_CARD',
  COLUMN: 'ACTIVE_ITEM_COLUMN'
})

export const NOTIFICATION_TYPES = createEnum({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REMOVED: 'removed'
})

export const NOTIFICATION_STATUS = createEnum({
  UNREAD: 'unread',
  READ: 'read'
})

export const BOARD_TYPE = createEnum({
  PUBLIC: 'public',
  PRIVATE: 'private'
})

export const MEMBER_STATUS = createEnum({
  PENDING: 'pending',
  ACCEPTED: 'accepted'
})

export const BOARD_MEMBER_ROLE = createEnum({
  MEMBER: 'member',
  OWNER: 'owner'
})

export const SOCKET_EVENTS = createEnum({
  UPDATE_BOARD: 'updateBoard',
  UPDATE_COLUMN: 'updateColumn',
  UPDATE_CARD: 'updateCard',
  UPDATE_MEMBER: 'updateMember',
  REGISTER: 'register',
  JOIN_BOARD: 'join-board',
  NOTIFICATION: 'notification'
})
