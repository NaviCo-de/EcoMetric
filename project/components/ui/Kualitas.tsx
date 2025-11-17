import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const kualitasVariants = cva(
  "px-8 py-2 rounded-[20px] shadow-md text-black text-center w-fit font-bold text-b10",
  {
    variants: {
      variant: {
        GOOD: "bg-[#A5C5D8]",
        MODERATE: "bg-[#D6D3B4]",
        POOR: "bg-[#D69D9E]"
      }
    }
  }
)

function Kualitas({ 
  className, 
  variant, 
  asChild = false,
  ...props 
}: React.ComponentProps<"div"> &
  VariantProps<typeof kualitasVariants> & {
    asChild?: boolean
  }) {

  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="div"
      className={cn(kualitasVariants({ variant, className}))}
      {...props}
    >
      {variant == 'GOOD' && 'Good'}
      {variant == 'MODERATE' && 'Moderate'}
      {variant == 'POOR' && 'Poor'}
    </Comp>
  )
}

export { Kualitas, kualitasVariants }
