
'use client'

import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

import { toast } from 'sonner'

import { ApiResponse } from '@/types/ApiResponse'
import { messageSchema } from '@/schemas/messageSchema'

const specialChar = '||'

const parseStringMessages = (messageString: string): string[] => {
  return messageString
    .split(specialChar)
    .map((message) => message.trim())
    .filter((message) => message.length > 0)
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?"

export default function SendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username

  const [completion, setCompletion] = useState(initialMessageString)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  })

  const messageContent = form.watch('content')

  const [isLoading, setIsLoading] = useState(false)

  const handleMessageClick = (message: string) => {
    form.setValue('content', message, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const onSubmit = async (
    data: z.infer<typeof messageSchema>
  ) => {
    setIsLoading(true)

    try {
      const response = await axios.post<ApiResponse>(
        '/api/send-message',
        {
          ...data,
          username,
        }
      )

      toast.success(response.data.message)

      form.reset({
        content: '',
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error(
        axiosError.response?.data.message ??
          'Failed to send message'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true)
    setSuggestError(null)

    try {
      const response = await axios.post(
        '/api/suggest-messages'
      )

      setCompletion(response.data)
    } catch (error) {
      console.error(
        'Failed to fetch suggested messages:',
        error
      )

      setSuggestError(
        'Failed to generate suggested messages'
      )
    } finally {
      setIsSuggestLoading(false)
    }
  }

  return (
    <div className="container mx-auto my-8 max-w-4xl rounded-lg bg-white p-6">
      <h1 className="mb-6 text-center text-4xl font-bold">
        Public Profile Link
      </h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Field
          data-invalid={
            !!form.formState.errors.content
          }
        >
          <FieldLabel htmlFor="content">
            Send Anonymous Message to @{username}
          </FieldLabel>

          <Textarea
            id="content"
            placeholder="Write your anonymous message here"
            className="resize-none"
            aria-invalid={
              !!form.formState.errors.content
            }
            {...form.register('content')}
          />

          <FieldDescription>
            Your message will be sent anonymously.
          </FieldDescription>

          {form.formState.errors.content && (
            <FieldError>
              {form.formState.errors.content.message}
            </FieldError>
          )}
        </Field>

        <div className="flex justify-center">
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!messageContent}
            >
              Send It
            </Button>
          )}
        </div>
      </form>

      <div className="my-8 space-y-4">
        <div className="space-y-2">
          <Button
            type="button"
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Suggest Messages'
            )}
          </Button>

          <p className="text-sm text-muted-foreground">
            Click on any message below to select it.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            {suggestError ? (
              <p className="text-sm text-red-500">
                {suggestError}
              </p>
            ) : (
              parseStringMessages(completion).map(
                (message, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    className="mb-2 justify-start whitespace-normal text-left"
                    onClick={() =>
                      handleMessageClick(message)
                    }
                  >
                    {message}
                  </Button>
                )
              )
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">
          Get Your Message Board
        </div>

        <Link href="/sign-up">
          <Button type="button">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  )
}
