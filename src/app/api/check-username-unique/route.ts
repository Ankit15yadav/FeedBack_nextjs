import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";


// query schema bna rhe hai checking k lie
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    //TODO use this in all other routes
    if (request.method !== 'GET') {
        return Response.json({
            success: false,
            message: "Method not allowed",

        }, { status: 405 })
    }

    await dbConnect();

    try {

        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        // validation with zod
        const result = UsernameQuerySchema.safeParse
            (queryParam);

        console.log(result);
        if (!result.success) {
            const usernameErrors = result.error.format().
                username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                    ? usernameErrors.join(', ')
                    : "Invalid query parameters",
            }, { status: 400 });
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "username already taken"
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "username is unique"
        }, { status: 200 });

    } catch (err) {
        console.error("Error checking username", err);
        return Response.json({
            success: false,
            message: "error checking username"
        },
            {
                status: 500
            })
    }
}
