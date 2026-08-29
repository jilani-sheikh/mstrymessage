'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { CalendarDays, X } from "lucide-react";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import axios from "axios";
import dayjs from "dayjs";


type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string)=> void
}

const MessageCard = ({message, onMessageDelete} : MessageCardProps) => {
   
    const handleDeleteConfirm = async() => {
         const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
         toast.success(response.data.message);

         onMessageDelete(message._id.toString())
    }

 return (
    <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow duration-200 hover:shadow-sm hover:ring-foreground/20">
      <CardHeader className="gap-y-2 pt-4 pb-3 sm:pt-5 sm:pb-4">
        {/*
          Message text is never truncated or clamped - it always wraps
          and stays fully readable. `min-w-0` lets the 1fr grid column
          shrink below its content, and `break-words` stops long tokens
          (URLs, unbroken strings) from overflowing the card.
        */}
        <CardTitle className="min-w-0 max-w-none text-sm leading-6 font-normal break-words whitespace-normal text-pretty sm:text-[0.9375rem] sm:leading-[1.65]">
          {message.content}
        </CardTitle>

        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete message"
                className="size-11 touch-manipulation rounded-md text-muted-foreground/70 transition-colors group-hover/card:text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:text-destructive sm:size-7"
              >
                <X className="size-4 sm:size-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[calc(100vw-2rem)] sm:w-full">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>

      </CardHeader>

      {/*
        The meta footer is pinned to the bottom with `mt-auto`, so cards that
        share a grid row stay balanced regardless of message length. The inset
        hairline divider separates content from metadata without a second card.
      */}
      <CardContent className="mt-auto pb-4 sm:pb-5">
        <CardDescription className="flex items-center gap-1.5 border-t border-border/70 pt-3 text-xs font-normal">
          <CalendarDays className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
          <span className="break-words tabular-nums">
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
          </span>
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default MessageCard