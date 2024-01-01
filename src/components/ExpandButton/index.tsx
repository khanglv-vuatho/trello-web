import React, { useState } from "react"

import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { ArrowDown2 } from "iconsax-react"

const ExpandButton: React.FC<{
  title?: string
  isIconOnly?: boolean
  startContent?: React.ReactNode
  props?: any
  children?: React.ReactNode
  content: React.ReactNode
  endContent?: React.ReactNode
  style?: string
  variant?: "solid" | "faded" | "bordered" | "light" | "flat" | "ghost" | "shadow"
  placement?: "top" | "bottom" | "left" | "right"
}> = ({ title, isIconOnly, props, children, placement, content, startContent, endContent, style, variant }) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false)

  const handlePopoverToggle = () => {
    setPopoverOpen(!isPopoverOpen)
  }

  const defaultButtonProps = {
    disableAnimation: true,
    disableRipple: true,
    radius: isIconOnly ? ("full" as const) : ("none" as const),
    variant: variant ? variant : ("light" as const),
    endContent: endContent ? endContent : <></>,
    startContent: startContent ? startContent : <></>,
    onClick: handlePopoverToggle,
    isIconOnly,
    className: `flex items-center gap-2 font-medium text-primary px-4 min-h-10 ${isIconOnly ? "overflow-visible" : "rounded-[3px]"} ${style ? style : ""}`,
  }

  const buttonElement = React.cloneElement(<Button {...defaultButtonProps}>{isIconOnly ? children : title}</Button>, { ...props })

  return (
    <Popover placement={placement || "bottom"} isOpen={isPopoverOpen} onClose={() => setPopoverOpen(false)}>
      <PopoverTrigger>{buttonElement}</PopoverTrigger>
      <PopoverContent>
        {<div className="">{content}</div> || (
          <div className="px-1 py-2">
            <div className="text-small font-bold">Popover Content</div>
            <div className="text-tiny">This is the popover content</div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default ExpandButton
