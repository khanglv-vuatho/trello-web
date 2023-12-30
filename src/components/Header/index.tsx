"use client"

import { Avatar, Badge, Button, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { Add, ArrowDown2, Element, Notification, SearchNormal1, Trello } from "iconsax-react"

import HelpIcon from "../Icons"
import { useState } from "react"

function Header() {
  const listExpandButton = [{ title: "Workspaces" }, { title: "Recent" }, { title: "Starred" }, { title: "Templates" }]

  return (
    <header className="flex items-center justify-between px-4 h-header bg-colorHeader text-primary overflow-x-auto">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="hover:bg-default/40 p-1.5 rounded-[3px] cursor-pointer">
            <Element size={24} />
          </span>
          <div className="flex items-center gap-1 p-1 hover:bg-default/40 rounded-[3px] cursor-pointer">
            <Trello size="24" color="#fff" variant="Bold" />
            <p className="text-xl font-bold">Trello</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mr-2">
          {listExpandButton.map((i) => (
            <ExpandButton title={i.title} key={i.title} />
          ))}
        </div>
        <Button className="flex items-center gap-2 font-medium text-primary rounded-[3px] p-2" variant="light" startContent={<Add />}>
          Create
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search"
          autoComplete="off"
          startContent={<SearchNormal1 size={24} className="text-primary2" />}
          endContent={<Add size={16} className="rotate-45 text-primary2" />}
          classNames={{
            inputWrapper: "max-h-10",
          }}
          className="min-w-[120px]"
        />
        <Badge content="" shape="circle" color="danger" placement="top-right" size="sm">
          <Notification className="rotate-45" />
        </Badge>
        <HelpIcon className={"h-6 w-6 flex-shrink-0"} />
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="h-6 w-6 flex-shrink-0" />
      </div>
    </header>
  )
}

const ExpandButton: React.FC<{ title: string }> = ({ title }) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false)

  const handlePopoverToggle = () => {
    setPopoverOpen(!isPopoverOpen)
  }

  return (
    <Popover placement="bottom" isOpen={isPopoverOpen} onClose={() => setPopoverOpen(false)}>
      <PopoverTrigger>
        <Button
          disableAnimation
          disableRipple
          className="flex items-center gap-2 font-medium text-primary rounded-[3px] p-2"
          radius="none"
          variant="light"
          endContent={<ArrowDown2 size={16} />}
          onClick={handlePopoverToggle}
        >
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Popover Content</div>
          <div className="text-tiny">This is the popover content</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
export default Header
