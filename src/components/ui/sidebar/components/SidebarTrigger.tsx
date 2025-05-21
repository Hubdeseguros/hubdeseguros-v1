import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"

interface SidebarTriggerProps
  extends React.ComponentProps<"button"> {
  className?: string
  asChild?: boolean
}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(
  ({ className, asChild = false, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-accent",
          className
        )}
        onClick={toggleSidebar}
        {...props}
      >
        <span className="sr-only">Toggle sidebar</span>
      </Comp>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"
