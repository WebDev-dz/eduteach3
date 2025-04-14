import * as React from "react"
import { cn } from "@/lib/utils"
import { useFormField } from "@/components/ui/form" // adjust path if needed

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, readOnly, ...props }, ref) => {
  const { isReadonly } = useFormField()
  const finalReadOnly = readOnly ?? isReadonly

  return (
    <textarea
      readOnly={finalReadOnly}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        finalReadOnly && "bg-muted cursor-not-allowed opacity-75",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
