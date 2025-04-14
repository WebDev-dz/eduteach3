import * as React from "react"
import { cn } from "@/lib/utils"
import { useFormField } from "@/components/ui/form" // make sure this path is correct

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, readOnly, ...props }, ref) => {
    const { isReadonly } = useFormField()

    const finalReadOnly = readOnly ?? isReadonly

    return (
      <input
        type={type}
        readOnly={finalReadOnly}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          finalReadOnly && "bg-muted cursor-not-allowed opacity-75", // optional style tweak
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
