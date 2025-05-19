import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  children: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ children, className, ...props }, ref) => {
    const validChildren = React.Children.toArray(children).filter(child => {
      return React.isValidElement(child) || typeof child === 'string';
    });
    
    return (
      <nav 
        ref={ref} 
        aria-label="breadcrumb" 
        className={cn("flex", className)}
        {...props}
      >
        <BreadcrumbList>
          {validChildren.map((child, index) => {
            const isLast = index === validChildren.length - 1;
            
            // Si es un string, lo envolvemos en un BreadcrumbLink
            if (typeof child === 'string') {
              return (
                <BreadcrumbItem key={index} isLast={isLast}>
                  <BreadcrumbLink>{child}</BreadcrumbLink>
                  {!isLast && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              );
            }
            
            // Si es un elemento React válido
            if (React.isValidElement(child)) {
              return (
                <BreadcrumbItem key={index} isLast={isLast}>
                  {child}
                  {!isLast && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              );
            }
            
            return null;
          })}
        </BreadcrumbList>
      </nav>
    );
  }
)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {
  separator?: React.ReactNode;
  isLast?: boolean;
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(({ 
  className, 
  separator, 
  isLast = false, 
  children,
  ...props 
}, ref) => {
  // Si no hay children, retornar null
  if (!children) return null;

  // Si children es un string, lo envolvemos en un BreadcrumbLink
  if (typeof children === 'string') {
    return (
      <li
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className, {
          'font-medium text-foreground': isLast
        })}
        aria-current={isLast ? 'page' : undefined}
        {...props}
      >
        {separator && <span className="text-muted-foreground">{separator}</span>}
        <BreadcrumbLink className="inline-flex items-center">
          {children}
        </BreadcrumbLink>
      </li>
    );
  }

  // Si children es un elemento React válido
  if (React.isValidElement(children)) {
    // Si el elemento ya tiene una clase, la mantenemos y añadimos las nuestras
    const existingClassName = children.props?.className || '';
    const newClassName = cn(existingClassName, 'inline-flex items-center');
    
    // Clonamos el elemento con las nuevas props
    const clonedChild = React.cloneElement(children, {
      ...children.props,
      className: newClassName
    });
    
    return (
      <li
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className, {
          'font-medium text-foreground': isLast
        })}
        aria-current={isLast ? 'page' : undefined}
        {...props}
      >
        {separator && <span className="text-muted-foreground">{separator}</span>}
        {clonedChild}
      </li>
    );
  }

  // Para cualquier otro caso, retornar null
  return null;
})
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </span>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
