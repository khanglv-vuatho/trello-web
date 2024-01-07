export const capitalizeFirstLetter = (val: string) => {
  if (!val) return ""
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
