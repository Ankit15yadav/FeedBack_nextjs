import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"
// import { POST } from "../sign-up/route";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    //  we have to do assertion -> as User
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated",
        }, { status: 401 })
    }

    const userId = user._id
    const { accetpMessages } = await request.json()

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: accetpMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Updated User not found",
            }, { status: 401 });
        }

        return Response.json({
            success: true,
            message: "message acceptance status updated successfully",
        }, { status: 200 });

    } catch (err) {
        return Response.json({
            success: false,
            message: "Failed to update status to send messages",
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    //  we have to do assertion -> as User
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated",
        }, { status: 401 })
    }

    const userId = user._id;

    try {

        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "user not found",
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 })

    } catch (err) {
        return Response.json({
            success: false,
            message: "Error in getting acceptance message",
        }, { status: 500 });
    }
}