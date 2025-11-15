import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "flex items-center justify-center px-5 py-2",
  {
    variants: {
      variant: {
        auth: "bg-blue-base rounded-[22px] border-blue-50 border hover:scale-105 hover:bg-blue-60"
      },
    },
  }
)

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }), "duration-150")}
      {...props}
    />
  )
}

export { Button, buttonVariants }