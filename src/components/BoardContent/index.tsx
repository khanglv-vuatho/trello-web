"use client"

import { Button, Card, CardBody } from "@nextui-org/react"
import ExpandButton from "../ExpandButton"
import { MoreHoriz as MoreHorizIcon, Add as AddIcon, DragHandle as DragHandleIcon } from "@mui/icons-material"
import Image from "next/image"
function BoardContent() {
  return (
    <div className="bg-colorBoardContent h-boardContent flex items-start gap-4 p-2">
      <div className="rounded-lg bg-[#f1f2f4] w-full max-w-[300px] p-2">
        <div className="flex items-center justify-between">
          <h3 className="pl-3 font-semibold">Column Title</h3>
          <ExpandButton isIconOnly content={<>Expand ...</>}>
            <MoreHorizIcon className="text-black" />
          </ExpandButton>
        </div>
        <div className="flex flex-col gap-2 py-2">
          <Card className="rounded-lg">
            <CardBody className="p-2 ">123</CardBody>
          </Card>
          <Card className="rounded-lg">
            <CardBody className="p-2 ">123</CardBody>
          </Card>
          <Card className="rounded-lg">
            <CardBody className="p-2 ">{/* <Image alt="Card background" className="" src="/images/hero-card-complete.jpeg" width={270} height={300} /> */}</CardBody>
          </Card>
        </div>
        <div className="flex items-center">
          <Button startContent={<AddIcon className="text-[#091E42]" />} className="rounded-lg w-full justify-start p-2 bg-transparent hover:bg-[#091E4224]">
            Add a card
          </Button>
          <ExpandButton isIconOnly content={<>DragHandleIcon ...</>}>
            <DragHandleIcon className="text-black" />
          </ExpandButton>
        </div>
      </div>
    </div>
  )
}

export default BoardContent
