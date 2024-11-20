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

export const decodeEmail = (encodedEmail: string) => {
  return decodeURIComponent(encodedEmail)
}
