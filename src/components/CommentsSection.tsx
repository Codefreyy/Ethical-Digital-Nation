import React, { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { formatDistanceToNow } from "date-fns"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Id } from "../../convex/_generated/dataModel"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "./ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

type CommentProp = {
  comment: any
  replies: any[]
  onReply: (parentId: string, content: string) => void
  onDelete: (commentId: string) => void
  currentUser: any
}

// 单个评论组件，显示评论内容及其子评论，并支持回复功能
const Comment = ({
  comment,
  replies,
  onReply,
  onDelete,
  currentUser,
}: CommentProp) => {
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleReply = () => {
    onReply(comment._id, replyContent)
    setReplyContent("")
    setIsReplying(false)
  }

  const handleCancelReply = () => {
    setReplyContent("")
    setIsReplying(false)
  }

  const deleteComment = useMutation(api.comments.deleteComment)

  const handleDelete = async () => {
    await deleteComment({ commentId: comment._id, userId: currentUser._id })
    onDelete(comment._id)
    setIsDialogOpen(false)
  }

  return (
    <div className="comment mb-4">
      <div className="flex items-center gap-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="font-semibold cursor-pointer underline hover:no-underline">
              {comment.user?.username || "Unknown User"}
            </span>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex flex-col space-y-1">
              <h4 className="text-sm font-semibold">
                @{comment.user?.username}
              </h4>
              <p className="text-sm">
                <strong>Email:</strong> {comment.user?.email}
              </p>
              <p className="text-sm">
                <strong>Bio:</strong> {comment.user?.bio}
              </p>
              <p className="text-sm">
                <strong>Organization:</strong> {comment.user?.organization}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
        <span className="text-gray-500 text-sm">
          {formatDistanceToNow(new Date(comment.createdAt))} ago
        </span>
        {/* delete comment */}
        {currentUser && currentUser._id === comment.userId && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  •••
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this comment? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button variant="destructive" onClick={handleDelete}>
                    Yes, Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
      <p className="mt-2">{comment.content}</p>
      <div className="flex gap-2">
        <Button
          className="text-blue-500 p-0"
          variant="link"
          onClick={() => setIsReplying(!isReplying)}
        >
          Reply
        </Button>
      </div>

      {isReplying && (
        <div className="mt-2">
          <div className="flex flex-col gap-2 justify-end items-start">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-grow"
            />
            <div className="flex gap-2">
              {" "}
              <Button variant="outline" onClick={handleCancelReply}>
                Cancel
              </Button>
              <Button onClick={handleReply} className="self-end sm:self-auto">
                Submit
              </Button>{" "}
            </div>
          </div>
        </div>
      )}

      {replies && replies.length > 0 && (
        <div className="replies ml-4 mt-4">
          {replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              replies={reply.replies}
              onReply={onReply}
              currentUser={currentUser}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type CommentSectionProps = {
  eventId: string
  currentUser: any
}

// 评论区组件，用于展示评论列表并允许用户发表评论或回复
const CommentsSection = ({ eventId, currentUser }: CommentSectionProps) => {
  const [newCommentContent, setNewCommentContent] = useState("")
  const queryComment = useQuery(api.comments.getComments, {
    eventId: eventId as Id<"events">,
  })
  console.log("queryComment", queryComment)
  const [comments, setComments] = useState<any[]>([])

  console.log("comments", comments)
  useEffect(() => {
    if (queryComment) {
      setComments(queryComment)
    }
  }, [queryComment])

  // 使用 useMutation 创建新的评论
  const createComment = useMutation(api.comments.createComment)

  const handleNewComment = async () => {
    if (!newCommentContent.trim()) return
    await createComment({
      eventId: eventId as Id<"events">,
      userId: currentUser._id,
      content: newCommentContent,
    })
    setNewCommentContent("")
  }

  const handleReply = async (parentId: any, content: string) => {
    if (!content.trim()) return
    await createComment({
      eventId: eventId as Id<"events">,
      userId: currentUser._id,
      parentId,
      content,
    })
  }
  const handleDelete = (commentId: string) => {
    setComments((comments ?? []).filter((comment) => comment._id !== commentId))
  }

  return (
    <div className="comments-section mt-8">
      <h3 className="font-semibold mb-2">Comments</h3>

      <div className="new-comment flex flex-col gap-2 justify-end items-start">
        <Textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button className="self-end sm:self-auto" onClick={handleNewComment}>
          Submit
        </Button>
      </div>

      <Separator className="my-3" />

      {comments &&
        comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            replies={comment.replies}
            onReply={handleReply}
            onDelete={handleDelete}
            currentUser={currentUser}
          />
        ))}
    </div>
  )
}

export default CommentsSection
