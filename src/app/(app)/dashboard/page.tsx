'use client'

import MessageCard from "@/components/MessageCard"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Copy, Inbox, Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const Page = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessage: false,
    },
  })

  const { watch, setValue } = form

  const acceptMessages = watch("acceptMessage")

  // Delete message
   const handleDeleteMessage = (messageId: string) => {
  setMessages((prevMessages) =>
    prevMessages.filter(
      (message) => message._id.toString() !== messageId
    )
  )
}
  // Fetch message accepting status
  const fetchAcceptMessage = useCallback(async () => {

    setIsSwitchLoading(true)

    try {

      const response = await axios.get("/api/accept-messages")

      setValue(
        "acceptMessage",
        response.data.isAcceptingMessage
      )

    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>

      toast.error("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
      })

    } finally {

      setIsSwitchLoading(false)

    }

  }, [setValue])

  // Fetch messages
  const fetchMessages = useCallback(
    async (showRefreshToast: boolean = false) => {

      setIsLoading(true)

      try {

        const response = await axios.get<ApiResponse>(
          "/api/get-messages"
        )

        setMessages(response.data.messages || [])

        if (showRefreshToast) {
          toast.success("Messages Refreshed", {
            description: "Showing the latest messages.",
          })
        }

      } catch (error) {

        const axiosError = error as AxiosError<ApiResponse>

        toast.error("Error", {
          description:
            axiosError.response?.data.message ||
            "Failed to fetch messages",
        })

      } finally {

        setIsLoading(false)

      }
    },
    []
  )

  // Fetch data when session is available
  useEffect(() => {

    if (!session?.user) return

    fetchMessages()
    fetchAcceptMessage()

  }, [session, fetchMessages, fetchAcceptMessage])

  // Handle switch change
  const handleSwitchChange = async () => {

    setIsSwitchLoading(true)

    try {

      const response = await axios.post<ApiResponse>(
        "/api/accept-messages",
        {
          acceptMessages: !acceptMessages,
        }
      )

      setValue(
        "acceptMessage",
        !acceptMessages
      )

      toast.success(response.data.message)

    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>

      toast.error("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to update message settings",
      })

    } finally {

      setIsSwitchLoading(false)

    }
  }

  // If user is not logged in
  if (!session?.user) {
    return <div>Please Login</div>
  }

  const { username } = session.user as User

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : ""

  const profileUrl = `${baseUrl}/u/${username}`

  // Copy profile URL
  const copyToClipboard = async () => {

    try {

      await navigator.clipboard.writeText(profileUrl)

      toast.success("URL Copied!", {
        description:
          "Profile URL has been copied to clipboard.",
      })

    } catch {

      toast.error("Failed to copy URL")

    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      {/* PAGE HEADER */}
      <header className="flex items-start justify-between gap-4">

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
            User Dashboard
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            Manage your anonymous inbox and sharing settings.
          </p>
        </div>

        {/* Refresh Messages */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
          aria-label="Refresh messages"
          className="size-11 shrink-0 touch-manipulation sm:size-9"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCcw className="size-4" />
          )}
        </Button>

      </header>

      {/* SHARING + PREFERENCES: one panel, two settings rows */}
      <Card className="mt-5 gap-0 overflow-hidden py-0 sm:mt-6">

        <div className="grid gap-3 p-4 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-5 sm:p-5">

          <div className="min-w-0">
            <CardTitle className="text-sm font-medium">
              Copy Your Unique Link
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs leading-relaxed">
              Share this link to receive anonymous messages.
            </CardDescription>
          </div>

          {/*
            A single joined "copy field". The read-only Input keeps its exact
            value / disabled / readOnly wiring and is visually flattened into
            the surrounding bordered container, so the URL and the Copy action
            read as one control instead of a broken form row.
          */}
          <div className="flex min-w-0 items-center rounded-lg border border-input bg-muted/40 transition-colors hover:bg-muted/60 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50">
            <Input
              type="text"
              value={profileUrl}
              disabled
              readOnly
              aria-label="Your unique profile link"
              className="h-11 w-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 font-mono text-xs outline-none disabled:bg-transparent disabled:opacity-100 focus-visible:ring-0 sm:h-9 sm:text-sm"
            />
            <span aria-hidden="true" className="h-5 w-px shrink-0 bg-border" />
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              className="h-11 shrink-0 gap-1.5 rounded-l-none px-3.5 font-medium hover:bg-transparent focus-visible:border-transparent focus-visible:ring-0 active:translate-y-0 sm:h-9"
            >
              <Copy className="size-3.5" aria-hidden="true" />
              Copy
            </Button>
          </div>

        </div>

        <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-5 sm:p-5">

          <div className="min-w-0">
            <CardTitle className="text-sm font-medium">
              Accept Messages
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs leading-relaxed">
              {acceptMessages
                ? "Visitors can send you anonymous messages."
                : "Anonymous messaging is currently paused."}
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 sm:justify-end">
            <span
              aria-hidden="true"
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium tabular-nums transition-colors",
                acceptMessages
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {acceptMessages ? "On" : "Off"}
            </span>

            {/*
              The switch keeps its exact checked / onCheckedChange / disabled
              wiring. Only the invisible ::after hit area is expanded so the
              touch target reaches ~56x66px on phones.
            */}
            <Switch
              id="accept-messages"
              aria-label="Accept Messages"
              checked={acceptMessages ?? false}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="shrink-0 after:-inset-x-3 after:-inset-y-3"
            />
          </div>

        </div>

      </Card>

      {/* INBOX */}
      <section className="mt-6 sm:mt-8">

        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight sm:text-base">
            Your Messages
          </h2>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {messages.length}
          </span>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">

          {messages.length > 0 ? (

            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))

          ) : (

            <div className="col-span-full flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center sm:py-14">
              <Inbox
                className="size-6 text-muted-foreground/60"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-medium">
                No messages to display.
              </p>
              <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Share your link above to start receiving messages.
              </p>
            </div>

          )}

        </div>

      </section>

    </div>
  )
}

export default Page