import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        // Check authentication
        if (!session?.user?._id) {
            return Response.json(
                {
                    success: false,
                    message: "Not Authenticated",
                },
                {
                    status: 401,
                }
            );
        }

        // Find the logged-in user
        const user = await UserModel.findById(session.user._id)
            .select("messages");

        // User does not exist in database
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json(
            {
                success: true,
                messages: user.messages || [],
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error("Error fetching messages:", error);

        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}