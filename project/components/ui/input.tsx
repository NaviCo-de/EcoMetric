import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "px-5 py-2 duration-500",
  {
    variants: {
      variant: {
        login: "bg-neutral-40 focus:bg-white not-placeholder-shown:bg-white border-blue-50 border rounded-md outline-0",
        data: "bg-neutral-20 focus:bg-white not-placeholder-shown:bg-white border-neutral-70 border rounded-lg outline-0"
      }
    }
  }
)

function Input({ 
  className, 
  variant, 
  type, 
  asChild = false,
  ...props 
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    asChild?: boolean
  }) {

  const Comp = asChild ? Slot : "input";
  return (
    <Comp
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className}))}
      {...props}
    />
  )
}

export { Input, inputVariants }
