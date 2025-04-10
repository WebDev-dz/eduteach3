"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  text: string
  timestamp: Date
}

interface AssignmentFeedbackProps {
  assignmentId: string
  studentId: string
  feedback?: string
  comments: Comment[]
  onAddComment: (text: string) => Promise<void>
}

export function AssignmentFeedback({
  assignmentId,
  studentId,
  feedback,
  comments = [],
  onAddComment,
}: AssignmentFeedbackProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await onAddComment(newComment)
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback & Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium">Teacher Feedback</h4>
            <p className="text-sm">{feedback}</p>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-medium">Comments</h4>
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>
                      {comment.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{comment.author.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmitComment} disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </CardFooter>
    </Card>
  )
}
