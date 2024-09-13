import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User"
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()

    try {

        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            userName: username,
            isVerified: true,
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            },
                {
                    status: 400
                })
        }

        const existingUserByEmail = await UserModel.findOne({ email: email })

        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

        // main condition
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "user already exist with this email"
                }, { status: 400 })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpire = new
                    Date(Date.now() + 3600000);

                await existingUserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                userName: username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpire: expiryDate,
                isAcceptingMessage: true,
                isVerified: false,
                messages: []
            })

            await newUser.save();
        }

        //sendverification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: false,
            message: "user registered successfullly, please verify your email",
        }, { status: 201 })

    } catch (error) {
        console.error("error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        },
            {
                status: 500,
            })

    }
}