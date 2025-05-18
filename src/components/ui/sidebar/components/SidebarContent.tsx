import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarProvider"

const sidebarVariants = cva(
  "flex flex-col min-h-svh transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        sidebar: "bg-sidebar",
        floating: "bg-background shadow-lg",
        inset: "bg-sidebar",
      },
      collapsible: {
        offcanvas: "w-[var(--sidebar-width)]",
        icon: "w-[var(--sidebar-width-icon)]",
        none: "w-[var(--sidebar-width)]",
      },
    },
    defaultVariants: {
      variant: "sidebar",
      collapsible: "offcanvas",
    },
  }
)

interface SidebarContentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof sidebarVariants> {
  side?: "left" | "right"
  className?: string
}

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  SidebarContentProps
>(
  (
    {
      side = "left",
      variant,
      collapsible,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { state, open, openMobile, isMobile } = useSidebar()
    const isExpanded = state === "expanded"

    return (
      <div
        ref={ref}
        className={cn(
          sidebarVariants({
            variant,
            collapsible: isMobile ? "offcanvas" : collapsible,
          }),
          "flex-none",
          side === "right" && "ml-auto",
          isMobile && "lg:fixed lg:inset-y-0",
          !isMobile && "transition-transform duration-300 ease-in-out",
          !isMobile &&
            (isExpanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarContent.displayName = "SidebarContent"
