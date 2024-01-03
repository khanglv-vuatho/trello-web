"use client"

import { Add as AddIcon, DragHandle as DragHandleIcon, MoreHoriz as MoreHorizIcon } from "@mui/icons-material"
import { Button, Card, CardBody } from "@nextui-org/react"
import ExpandButton from "../ExpandButton"

function BoardContent() {
  return (
    <div className="bg-colorBoardContent h-boardContent">
      <ListColumn />
    </div>
  )
}

const ListColumn = () => {
  return (
    <div className="flex gap-4 p-2">
      {/* map column */}
      <Column />
    </div>
  )
}
const Column = () => {
  return (
    <div className="rounded-lg bg-[#f1f2f4] w-full max-w-[300px] p-2">
      {/* header column */}
      <div className="flex items-center justify-between">
        <h3 className="pl-3 font-semibold">Column Title</h3>
        <ExpandButton isIconOnly content={<>Expand ...</>}>
          <MoreHorizIcon className="text-black" />
        </ExpandButton>
      </div>
      {/* body column (cards column)*/}
      <ListCard />
      {/* footer column */}
      <div className="flex items-center">
        <Button startContent={<AddIcon className="text-[#091E42]" />} className="rounded-lg w-full justify-start p-2 bg-transparent hover:bg-[#091E4224]">
          Add a card
        </Button>
        <ExpandButton isIconOnly content={<>DragHandleIcon ...</>}>
          <DragHandleIcon className="text-black" />
        </ExpandButton>
      </div>
    </div>
  )
}

const ListCard = () => {
  return (
    <div className="flex flex-col gap-2 py-2">
      {/* map CardContent */}

      <CardContent />
    </div>
  )
}
const CardContent = () => {
  return (
    <Card className="rounded-lg">
      <CardBody className="p-2 ">123</CardBody>
    </Card>
  )
}

export default BoardContent
