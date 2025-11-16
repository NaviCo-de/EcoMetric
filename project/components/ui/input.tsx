import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "px-5 py-2 duration-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  {
    variants: {
      variant: {
        login: "bg-neutral-40 focus:bg-white border-blue-50 border rounded-md outline-0",
        data: "bg-neutral-20 focus:bg-white border-neutral-70 border rounded-md outline-0 w-30 h-6 text-b10"
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
