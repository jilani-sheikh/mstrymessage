import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options";
import { success } from "zod";


export async function DELETE(request:Request, {params}: {params: Promise<{messageid: string}>}) {

    const messageId = (await params).messageid;

    await dbConnect()

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User

    if(!session || !session.user)
    {
        return Response.json(
            {
                 success:false,
                message:"Not Authenticated",
            },
            {
                status: 401
            }
           
        )
    }

    try {

        const updateResult = await UserModel.updateOne(
          { _id: user._id },
          { $pull: { messages: { _id: messageId } } },
        );


        if(updateResult.modifiedCount == 0) {
              
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already delete"
                },
                {
                    status: 404
                }
            )
             
        }

        return Response.json(
            {
                success: true,
                message: "Message Deleted"
            },
            {
                status:200
            }
        )
        
    } catch(error) {

        console.log("Error in delete Message route", error)
        
        return Response.json(
             {
                 success: false,
                 message: "Error deleting Message"
             },
             {
                  status:500
             }
        )

        
    }



}