import {z} from 'zod'

export const usernameValidation = z
     .string()
     .min(3, "Username must be atleast 2 character")
     .max(20, "username must be no more than 20 character")
     .regex(/^[a-zA-Z0-9_]{3,20}$/, "USername must not contain special character")

export const signUpSchema = z.object({
     username: usernameValidation,
     email: z.string().email({message:"Invalid email address"}),
     password: z.string().min(6,{message:"password must be atleast 6 character"})
})