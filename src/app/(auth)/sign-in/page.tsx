'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'

import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"


const page = () => {

  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),

    defaultValues: {
      identifier: '',
      password: ''
    }
  })


  // =========================
  // NORMAL LOGIN
  // =========================

  const onSubmit = async (
    data: z.infer<typeof signInSchema>
  ) => {

    const result = await signIn('credentials', {

      redirect: false,

      identifier: data.identifier,

      password: data.password

    })


    if (result?.error) {

      if (result.error === 'CredentialsSignin') {

        toast.error("Login failed", {
          description: "Incorrect username or password"
        })

      } else {

        toast.error("Error", {
          description: result.error
        })

      }

    }


    if (result?.url) {

      router.replace('/dashboard')

    }
  }


  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleSignIn = async () => {

    try {

      await signIn("google", {
        callbackUrl: "/dashboard"
      })

    } catch (error) {

      console.error("Google login error:", error)

      toast.error("Google login failed", {
        description: "Something went wrong. Please try again."
      })

    }
  }


  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-800">

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">

          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>

          <p className="mb-4">
            Sign in to continue your secret conversations
          </p>

        </div>


        {/* =========================
            NORMAL LOGIN
        ========================= */}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Identifier */}

          <Controller
            name="identifier"
            control={form.control}
            render={({ field, fieldState }) => (

              <Field data-invalid={fieldState.invalid}>

                <FieldLabel htmlFor="identifier">
                  Email/Username
                </FieldLabel>

                <Input
                  {...field}
                  id="identifier"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email or username"
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
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                />

                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                  />
                )}

              </Field>

            )}
          />


          {/* Sign In Button */}

          <Button
            className="w-full"
            type="submit"
            disabled={form.formState.isSubmitting}
          >

            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
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
            GOOGLE LOGIN
        ========================= */}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </Button>


        {/* Sign up */}

        <div className="text-center mt-4">

          <p>
            Not a member yet?{" "}

            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign up
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}


export default page