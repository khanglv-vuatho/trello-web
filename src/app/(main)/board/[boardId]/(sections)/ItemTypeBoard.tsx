type ItemTypeBoardProps = {
  item: { type: string; description: string }
  typeBoard: string
  setTypeBoard: (type: string) => void
}

const ItemTypeBoard = ({ item, typeBoard, setTypeBoard }: ItemTypeBoardProps) => {
  console.log({ item, typeBoard })
  return (
    <div className={`w-full rounded-lg border px-4 py-2 ${typeBoard == item.type ? 'border-white/50' : 'border-white/10'}`} onClick={() => setTypeBoard(item.type)}>
      {/* uppercase the first letter */}
      <p>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
      <p>{item.description}</p>
    </div>
  )
}

export default ItemTypeBoard
