import mongoose, { Schema, Document, Mongoose, mongo } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date,
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})


export interface User extends Document {
    userName: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpire: Date;
    isAcceptingMessage: boolean,
    isVerified: boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    userName: {
        type: String,
        required: [true, "UserName is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 'please use a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    verifyCode: {
        type: String,
        required: [true, "verify code is required"]
    },
    verifyCodeExpire: {
        type: Date,
        required: [true, "verify code exp is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;