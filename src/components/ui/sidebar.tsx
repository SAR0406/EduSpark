
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16.5rem";
const SIDEBAR_WIDTH_MOBILE = "17.5rem"
const SIDEBAR_WIDTH_ICON = "3.5rem"; 
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextValue = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true, 
      open: openProp,
      onOpenChange: setOpenProp,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    const [_open, _setOpen] = React.useState(() => {
      if (isMobile) return false;
      if (typeof window !== 'undefined') {
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
          ?.split("=")[1];
        if (cookieValue) return cookieValue === "true";
      }
      return defaultOpen;
    });

    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        if (isMobile) {
            setOpenMobile(typeof value === "function" ? value(openMobile) : value);
            return;
        }
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open, isMobile, openMobile]
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((current) => !current)
        : setOpen((current) => !current)
    }, [isMobile, setOpen, setOpenMobile])

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          if (isMobile) {
            setOpenMobile(false)
          } else {
            toggleSidebar()
          }
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar, isMobile, setOpenMobile])

    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={100}>
          <div ref={ref} {...props}>
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
  }
>(
  (
    {
      side = "left",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className={cn("w-[--sidebar-width] bg-[var(--sidebar-background)] p-0 text-sidebar-foreground [&>button]:hidden border-sidebar-border shadow-2xl holo-glass-2", className)} 
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
             <SheetTitle className="sr-only">Main Navigation Menu</SheetTitle>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <motion.div
        ref={ref}
        data-state={state}
        className={cn(
          "hidden md:flex flex-col h-screen transition-all duration-300 ease-in-out bg-[var(--sidebar-background)] border-r border-sidebar-border holo-glass-2",
          className
        )}
        initial={false}
        animate={{ width: state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/70 rounded-full", className)} 
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col w-full",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-1.5 p-3 min-h-[4rem] items-start justify-center", state === 'collapsed' && 'px-0 items-center', className)} 
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-1 p-2 mt-auto", className)} 
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 my-1 w-auto bg-sidebar-border", state === 'collapsed' && "mx-0.5 my-0.25", className)} 
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-0.5 p-2 overflow-y-auto overflow-x-hidden", 
        state === 'collapsed' && "items-center",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  const { state } = useSidebar();

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "transition-opacity duration-200 flex h-7 shrink-0 items-center rounded-md px-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-sidebar-foreground/40 outline-none ring-sidebar-ring focus-visible:ring-1", 
        (state === 'collapsed') ? "opacity-0 pointer-events-none -mt-6 hidden" : "opacity-100", 
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"


const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-lg p-2.5 text-left text-[0.85rem] font-medium outline-none ring-sidebar-ring transition-all duration-200 ease-in-out focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--sidebar-background)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:font-semibold data-[active=true]:shadow-[0_0_12px_hsl(var(--sidebar-primary)/0.5),0_0_6px_hsl(var(--sidebar-primary)/0.35),inset_0_0_1.5px_hsl(var(--sidebar-primary)/0.25)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-[1.1rem] [&>svg]:shrink-0", 
  {
    variants: {
      variant: {
        default: "",
      },
      size: { 
        default: "h-10", 
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface SidebarMenuButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      children: childrenProp,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const buttonContent = (
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-0 h-full w-0.5 bg-sidebar-primary rounded-r-full shadow-[0_0_10px_hsl(var(--sidebar-primary))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        {childrenProp}
      </AnimatePresence>
    );

    const buttonElement = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ variant, size }),
          state === "collapsed" && !isMobile && "!w-10 !h-10 !p-0 justify-center items-center", 
          className
        )}
        {...props}
      >
        {asChild ? (
          buttonContent
        ) : (
          <>
            {React.Children.map(childrenProp, (child, index) => {
              if (React.isValidElement(child) && typeof child.type !== 'string' && (child.type as any).displayName?.includes("Icon")) {
                return child; 
              }
              return null;
            })}
            <motion.span
              className="truncate flex-1"
              initial={{ opacity: 1, width: 'auto' }}
              animate={{
                opacity: state === 'expanded' || isMobile ? 1 : 0,
                width: state === 'expanded' || isMobile ? 'auto' : 0,
                display: state === 'expanded' || isMobile ? 'inline' : 'none',
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {React.Children.map(childrenProp, (child) => {
                if (typeof child === 'string' || (React.isValidElement(child) && typeof child.props.children === 'string')) {
                  return child;
                }
                return null;
              })}
            </motion.span>
            {isActive && !isMobile && state === 'expanded' && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-1.5 h-[calc(100%-0.75rem)] w-1 bg-sidebar-primary rounded-r-full shadow-[0_0_15px_hsl(var(--sidebar-primary))]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </>
        )}
      </Comp>
    );
    
    if (!tooltip || (state !== "collapsed" && !isMobile) || isMobile) {
      return buttonElement;
    }
    
    const tooltipContentProps = typeof tooltip === "string" ? { children: tooltip } : tooltip;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {buttonElement}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          className="bg-popover/80 backdrop-blur-md border-border/25 text-popover-foreground text-xs px-2 py-1 rounded-md shadow-lg" 
          {...tooltipContentProps}
        />
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton"


const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = true, ...props }, ref) => {
  const { state } = useSidebar();

  if (state === 'collapsed') {
    return (
       <div
        ref={ref}
        data-sidebar="menu-skeleton"
        className={cn("rounded-lg h-10 w-10 flex p-0 items-center justify-center", className)} 
        {...props}
      >
        <Skeleton className="size-5 rounded-sm bg-sidebar-accent/50" />
      </div>
    )
  }

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-lg h-10 flex gap-2.5 px-2.5 items-center", className)} 
      {...props}
    >
      {showIcon && (
        <Skeleton className="size-5 rounded-sm bg-sidebar-accent/50" />
      )}
      <Skeleton className="h-4 flex-1 bg-sidebar-accent/50" />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"


export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
