import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options";
import { success } from "zod";

export async function POST(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user:User = session?.user as User

    if(!session || !session.user)
    {
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },

            {status:401}
        )
    }


    const userId = user._id;
    const{acceptMessages} = await request.json()

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptngMessage : acceptMessages},
            {new:true}
        )

        if(!updatedUser){
            return Response.json(
                {
                    success:false,
                    message:"Failed to update user status to accept Messages"
                },
                {
                    status:401
                }
            )
        }


         return Response.json(
                {
                    success:true,
                    message:"Message acceptance status updated successfully",
                    updatedUser
                },
                {
                    status:200
                }
            )
        
    } catch (error) {
        console.log("Failed to update user status to accept Messages")
        return Response.json({
            success:false,
            message:"Failed to update user status to accept Messages"
        },
        {status : 500})
    }
}

export async function GET(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {status: 401}
        )
    }

    const userId = user._id;

   try {
     const foundUser =  await UserModel.findById(userId)
 
     if(!foundUser){
         return Response.json(
             {
                 success:false,
                 message:"User not found"
             },
             {
                 status:404
             }
         )
     }
 
     return Response.json(
         {
             success: true,
             isAcceptingMessage : foundUser.isAcceptngMessage
         },
         {
             status: 200
         }
     )
   } catch (error) {
       console.log("Failed to update user status to accept message")
       return Response.json(
        {
            success:false,
            message: "Error is getting message accceptance status"
        },
        {
            status:500
        }
       )
   }


}