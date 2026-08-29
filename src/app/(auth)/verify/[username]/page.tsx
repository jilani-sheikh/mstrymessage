'use client'
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Controller} from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function VerifyAccount() {

 const router = useRouter();
 const params = useParams<{username:string}>()

 const form = useForm<z.infer<typeof verifySchema>>({
     resolver: zodResolver(verifySchema)
 })

 const onSubmit = async (data: z.infer<typeof verifySchema>)=>{
      try {

        const response = await axios.post(`/api/verify-code`,{
            username: params.username,
            code: data.code
        })

        toast.success("Success", {
           description: response.data.message,
         });

         router.replace(`/sign-in`)
        
      } catch (error) {
            
          console.error("Error in verifying user", error)
        
                    const axiosError = error as AxiosError<ApiResponse>;
                    
                   
                  toast.error("Verification failed", {
                        description: axiosError.response?.data.message,
                        
                    });
           
               
          
      }   
 }


  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
          
          <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
               
               <div className='text-center'>
                    
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">

                        Verify your Account
                    </h1>

                    <p className='mb-4'>
                        Enter the verification code sent to your email
                    </p>

               </div>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <Controller
                               name="code"
                               control={form.control}
                               render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel htmlFor="code">Verification Code</FieldLabel>

                                  <Input
                                     {...field}
                                       id="code"
                                       aria-invalid={fieldState.invalid}
                                        placeholder="Enter verification code"
                                   />

                                   {fieldState.invalid && (
                                       <FieldError errors={[fieldState.error]} />
                                   )}
                              </Field>
                              )}
                              />

                             <Button type="submit">Verify</Button>
                    </form>

                </div>

    </div>
  )
}

export default VerifyAccount