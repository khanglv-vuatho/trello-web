"use client"

import { useEffect, useRef, useState } from "react"

import { Avatar, Badge, Button, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { Add, ArrowDown2, ArrowRotateRight, Element, Notification, SearchNormal1, Trello } from "iconsax-react"

import HelpIcon from "../Icons"
import instance from "@/services/axiosConfig"

function Header() {
  const [searchValue, setSearchValue] = useState("")
  const [onSearching, setOnSearching] = useState(false)

  const listExpandButton = [{ title: "Workspaces" }, { title: "Recent" }, { title: "Starred" }, { title: "Templates" }]

  const inputRef = useRef<any>(null)

  const _handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnSearching(true)
    setSearchValue(e.target.value)
  }

  const _handleSearching = async () => {
    try {
      // const { data } = instance.post("/home/search", {
      //   value: searchValue,
      // })
    } catch (error) {
      console.log(error)
    } finally {
      setOnSearching(false)
    }
  }

  const _handleClear = () => {
    setSearchValue("")
    inputRef.current.focus()
  }

  const searchTimer = useRef<any>(null)

  useEffect(() => {
    if (onSearching) {
      searchTimer.current = setTimeout(() => {
        _handleSearching()
      }, 500)
    }
    return () => {
      clearTimeout(searchTimer.current)
    }
  }, [onSearching])

  return (
    <header className="flex items-center justify-between px-4 h-header bg-colorHeader text-primary overflow-x-auto">
      <div className="flex items-center gap-4">
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
          <Button className="flex items-center gap-2 font-medium text-primary rounded-[3px] p-2" variant="light" startContent={<Add />}>
            Create
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          placeholder="Search"
          autoComplete="off"
          variant="bordered"
          startContent={<SearchNormal1 size={24} className="text-primary" />}
          endContent={
            onSearching && !!searchValue.length ? (
              <ArrowRotateRight size={24} className="animate-spin absolute right-1" />
            ) : (
              !!searchValue.length && <Add size={24} className="rotate-45 text-primary cursor-pointer absolute right-1" onClick={_handleClear} />
            )
          }
          classNames={{
            inputWrapper: "max-h-10 border-primary data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
            input: "text-primary placeholder:text-primary data-[has-start-content=true]:pr-5",
          }}
          className="min-w-[120px]"
          value={searchValue}
          onChange={_handleChange}
        />
        <Badge content="" shape="circle" color="danger" placement="top-right" size="sm">
          <Notification className="rotate-45 size-6 flex-shrink-0 cursor-pointer" />
        </Badge>
        <HelpIcon className="cursor-pointer" />
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="!size-8 flex-shrink-0 cursor-pointer" />
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
