import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User"
import { success } from "zod";

export async function POST(request:Request) {
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        
        if(!user){
            return Response.json(
                {
                    success:false,
                    message: "User not found"
                },
                {
                    status:404
                }
            )
        }

        //is User accepting the messages

        if(!user.isAcceptngMessage){
            return Response.json(
                {
                    success:false,
                    message:"User is not accepting the message",
                },
                {
                    status:403
                }
            )
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success:true,
                message:"Message send successfully"
            },
            {status:200}
        )



    } catch (error) {
        console.log("Error adding Messages", error)
        
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },
    {
        status:500
    })
        
    }
}