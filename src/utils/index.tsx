import { TBoards } from '@/types'

export const capitalizeFirstLetter = (val: string) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const mapOrder = (originalArray: any[], orderArray: string[], key: string) => {
  if (!originalArray || !orderArray || !key) return []

  const clonedArray = [...originalArray]
  const orderedArray = clonedArray.sort((a, b) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
  })

  return orderedArray
}

export const generatePlaceholderCard = (column: any) => {
  return {
    _id: `${column?._id}-placeholder-card`,
    boardId: column?.boardId,
    columnId: column?._id,
    FE_PlaceholderCard: true,
  }
}

export const cleanMessage = (errorMessage: string) => {
  // Check if the message contains "ValidationError" and clean it
  if (errorMessage.includes('ValidationError')) {
    const cleanMsg = errorMessage.split(':')[1].trim().replace(/"/g, '')
    return cleanMsg
  }
  return errorMessage
}

export const normalizeKeyword = (keyword: string) => {
  return keyword
    .normalize('NFD')
    .toLowerCase()
    .replace(/[\u0300-\u036f\s]/g, '')
    .replace('đ', 'd')
}

export const decodeEmail = (encodedEmail: string) => {
  return decodeURIComponent(encodedEmail)
}

export function objectToFormData(obj: any) {
  const formData = new FormData()

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const valueIsFile = value instanceof File

      const isArrayData = Array.isArray(value)
      const initialValue = typeof value === 'number' ? Number(value) : ''

      if (isArrayData) {
        const isFile = value.some((item) => item instanceof File)
        if (isFile) {
          Array.prototype.forEach.call(value, (item) => {
            formData.append(key, item)
          })
        } else {
          formData.append(key, value ? JSON.stringify(value) : '')
        }
      } else {
        if (typeof value === 'object' && !isArrayData && !valueIsFile) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value || initialValue)
        }
      }
    }
  }

  return formData
}
