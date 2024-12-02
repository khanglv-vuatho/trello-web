const createEnum = <T extends Record<string, string>>(obj: T) => Object.freeze(obj)

export const ITEM_TYPE = createEnum({
  CARD: 'ACTIVE_ITEM_CARD',
  COLUMN: 'ACTIVE_ITEM_COLUMN',
})

export const NOTIFICATION_TYPES = createEnum({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REMOVED: 'removed',
})

export const NOTIFICATION_STATUS = createEnum({
  UNREAD: 'unread',
  READ: 'read',
})

export const BOARD_TYPE = createEnum({
  PUBLIC: 'public',
  PRIVATE: 'private',
})

export const MEMBER_STATUS = createEnum({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
})
