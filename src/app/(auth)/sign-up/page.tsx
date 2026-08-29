'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Loader2 } from "lucide-react"


const page = () => {

  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300)

  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {

    const checkUsernameUnique = async () => {

      if (username) {

        setIsCheckingUsername(true)
        setUsernameMessage('')

        try {

          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          )

          setUsernameMessage(response.data.message)

        } catch (error) {

          const axiosError = error as AxiosError<ApiResponse>

          setUsernameMessage(
            axiosError.response?.data.message ??
            "Error checking username"
          )

        } finally {

          setIsCheckingUsername(false)

        }
      }
    }

    checkUsernameUnique()

  }, [username])


  const onSubmit = async (
    data: z.infer<typeof signUpSchema>
  ) => {

    setIsSubmitting(true)

    try {

      const response = await axios.post<ApiResponse>(
        '/api/sign-up',
        data
      )

      toast.success("Success", {
        description: response.data.message,
      })

      router.replace(`/verify/${username}`)

    } catch (error) {

      console.error("Error in signup of user", error)

      const axiosError = error as AxiosError<ApiResponse>

      const errorMessage =
        axiosError.response?.data.message ??
        "Something went wrong"

      toast.error("Signup failed", {
        description: errorMessage,
      })

    } finally {

      setIsSubmitting(false)

    }
  }


  // =========================
  // GOOGLE SIGN UP
  // =========================

  const handleGoogleSignUp = async () => {

    try {

      setIsGoogleLoading(true)

      await signIn("google", {
        callbackUrl: "/dashboard",
      })

    } catch (error) {

      console.error("Google signup error:", error)

      toast.error("Google signup failed", {
        description: "Something went wrong. Please try again.",
      })

      setIsGoogleLoading(false)
    }
  }


  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">

          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>

          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>

        </div>


        {/* =========================
            NORMAL SIGNUP
        ========================= */}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Username */}

          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (

              <Field data-invalid={fieldState.invalid}>

                <FieldLabel htmlFor="username">
                  Username
                </FieldLabel>

                <Input
                  {...field}
                  id="username"
                  autoComplete="username"
                  aria-invalid={fieldState.invalid}
                  onChange={(event) => {

                    field.onChange(event)

                    debounced(event.target.value)

                  }}
                />

                {isCheckingUsername && (
                  <p className="text-sm text-muted-foreground">
                    Checking username...
                  </p>
                )}

                {!isCheckingUsername && usernameMessage && (
                  <p className="text-sm text-muted-foreground">
                    {usernameMessage}
                  </p>
                )}

                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                  />
                )}

              </Field>

            )}
          />


          {/* Email */}

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (

              <Field data-invalid={fieldState.invalid}>

                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  {...field}
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                  />
                )}

              </Field>

            )}
          />


          {/* Password */}

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (

              <Field data-invalid={fieldState.invalid}>

                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <Input
                  {...field}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                  />
                )}

              </Field>

            )}
          />


          {/* Signup Button */}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isGoogleLoading}
          >

            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Signup'
            )}

          </Button>

        </form>


        {/* =========================
            DIVIDER
        ========================= */}

        <div className="flex items-center gap-4">

          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm text-gray-500">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-200" />

        </div>


        {/* =========================
            GOOGLE BUTTON
        ========================= */}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading || isSubmitting}
        >

          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting to Google...
            </>
          ) : (
            <>
              Continue with Google
            </>
          )}

        </Button>


        {/* Sign in link */}

        <div className="text-center mt-4">

          <p>
            Already a member?{" "}

            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default page