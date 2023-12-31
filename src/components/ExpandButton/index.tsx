import React, { useState } from "react"

import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { ArrowDown2 } from "iconsax-react"

const ExpandButton: React.FC<{ title?: string; isIconOnly?: boolean; props?: any; children?: React.ReactNode; content: React.ReactNode; placement?: "top" | "bottom" | "left" | "right" }> = ({
  title,
  isIconOnly,
  props,
  children,
  placement,
  content,
}) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false)

  const handlePopoverToggle = () => {
    setPopoverOpen(!isPopoverOpen)
  }

  const defaultButtonProps = {
    disableAnimation: true,
    disableRipple: true,
    radius: isIconOnly ? ("full" as const) : ("none" as const),
    variant: "light" as const,
    endContent: isIconOnly ? <></> : <ArrowDown2 size={16} />,
    onClick: handlePopoverToggle,
    isIconOnly,
    className: `flex items-center gap-2 justify-center font-medium text-primary p-2 ${isIconOnly ? "overflow-visible aspect-square" : ""}`,
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
