"use client"

import React, { useEffect, useRef, useState } from "react"

import { Apps as AppsIcon, NotificationsNoneOutlined as NotificationsIcon, HelpOutlineOutlined as HelpIcon } from "@mui/icons-material"
import { Avatar, Badge, Input } from "@nextui-org/react"
import { Add, ArrowDown2, SearchNormal1, Trello } from "iconsax-react"

import ExpandButton from "@/components/ExpandButton"
import { LoadingSearch } from "@/components/Icons"

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
        <Badge content="7" shape="circle" color="danger" placement="top-right" size="sm" classNames={{ badge: "!size-5" }}>
          <NotificationsIcon />
        </Badge>
      ),
      content: <>Badge</>,
    },
    {
      id: 2,
      children: <HelpIcon />,
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
          <div className="size-10 hover:bg-default/40 rounded-[3px] cursor-pointer flex items-center justify-center">
            <AppsIcon />
          </div>
          <div className="flex items-center justify-center min-h-10 gap-1 px-2 hover:bg-default/40 rounded-[3px] cursor-pointer">
            <Trello size="24" color="#fff" variant="Bold" />
            <p className="text-xl font-bold">Trello</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mr-2">
          {listExpandButton.map((item) => (
            <ExpandButton title={item.title} key={item.title} content={item.content} endContent={<ArrowDown2 size={16} />} />
          ))}
          <ExpandButton title={"Create"} content={<>Create</>} startContent={<Add size={24} />}></ExpandButton>
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
