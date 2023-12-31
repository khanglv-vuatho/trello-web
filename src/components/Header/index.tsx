"use client"

import React, { useEffect, useRef, useState } from "react"

import { Avatar, Badge, Button, Input } from "@nextui-org/react"
import { Add, Element, Notification, SearchNormal1, Trello } from "iconsax-react"

import { HelpIcon, LoadingSearch } from "@/components/Icons"
import ExpandButton from "@/components/ExpandButton"

function Header() {
  const [searchValue, setSearchValue] = useState("")
  const [onSearching, setOnSearching] = useState(false)

  const inputRef = useRef<any>(null)

  const listExpandButton: { title: string; content: React.ReactNode }[] = [
    { title: "Workspaces", content: <>Workspaces</> },
    { title: "Recent", content: <>Recent</> },
    { title: "Starred", content: <>Starred</> },
    { title: "Templates", content: <>Templates</> },
  ]

  const listRightHeader: { id: number; children: React.ReactNode; content: React.ReactNode }[] = [
    {
      id: 1,
      children: (
        <Badge content="7" shape="circle" color="danger" placement="top-right" size="sm" classNames={{ badge: "!size-5", base: "khang2" }}>
          <Notification className="rotate-45 size-6 flex-shrink-0 cursor-pointer" />
        </Badge>
      ),
      content: <>Badge</>,
    },
    {
      id: 2,
      children: <HelpIcon className="!size-6 flex-shrink-0" />,
      content: <div className="">HelpIcon</div>,
    },
    {
      id: 3,
      children: (
        <Avatar
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          className="!size-8 flex-shrink-0 cursor-pointer"
          classNames={{ base: "123", fallback: "123123", icon: "111", img: "1133", name: "12311" }}
        />
      ),
      content: <>Avatar</>,
    },
  ]

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
          {listExpandButton.map((item) => (
            <ExpandButton title={item.title} key={item.title} content={item.content} />
          ))}
          <Button className="flex items-center gap-2 font-medium text-primary rounded-[3px] p-2" variant="light" startContent={<Add />}>
            Create
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Input
          ref={inputRef}
          placeholder="Search"
          autoComplete="off"
          variant="bordered"
          startContent={<SearchNormal1 size={24} className="text-primary" />}
          endContent={
            onSearching && !!searchValue.length ? (
              <LoadingSearch className="animate-spin absolute right-1.5 text-white size-5 " />
            ) : (
              !!searchValue.length && <Add size={24} className="rotate-45 text-primary cursor-pointer absolute right-1" onClick={_handleClear} />
            )
          }
          classNames={{
            inputWrapper: "max-h-10 border-primary data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
            input: "text-primary placeholder:text-primary data-[has-start-content=true]:pr-4",
          }}
          className="min-w-[120px]"
          value={searchValue}
          onChange={_handleChange}
        />
        {listRightHeader.map((item) => (
          <ExpandButton key={item.id} isIconOnly content={item.content}>
            {item.children}
          </ExpandButton>
        ))}
      </div>
    </header>
  )
}

export default Header
