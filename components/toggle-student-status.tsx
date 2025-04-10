"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Server action
async function updateStudentStatus(studentId: string, isActive: boolean) {
  "use server"

  try {
    // Update student status in database
    // ...

    return { success: true }
  } catch (error) {
    return { error: "Failed to update student status" }
  }
}

export function ToggleStudentStatus({
  studentId,
  initialStatus,
}: {
  studentId: string
  initialStatus: boolean
}) {
  const [isActive, setIsActive] = useState(initialStatus)
  const [isPending, setIsPending] = useState(false)

  async function handleToggle() {
    setIsPending(true)

    // Optimistically update UI
    setIsActive(!isActive)

    const result = await updateStudentStatus(studentId, !isActive)

    if (result.error) {
      // Revert on error
      setIsActive(isActive)
      toast.error(result.error)
    }

    setIsPending(false)
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch checked={isActive} onCheckedChange={handleToggle} disabled={isPending} />
      <Label>{isActive ? "Active" : "Inactive"}</Label>
    </div>
  )
}
