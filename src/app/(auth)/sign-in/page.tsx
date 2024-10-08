"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import { useForm } from "react-hook-form"
import Link from 'next/link'
import { useEffect, useState } from "react"
// import { useDebounceValue, useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import Email from "next-auth/providers/email"
import { signInSchema } from "@/schemas/signInSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form"
import { FormField } from "@/components/ui/form"
import { FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

const page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // delay add krn do
    const { toast } = useToast();
    const router = useRouter();

    //zod implementation 
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        }
    });


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (result?.error) {
            toast({
                title: "Login failed",
                description: "Incorrect username or password",
                variant: "destructive"
            })
        }
        else {
            toast({
                title: "Logged in Successfully",
                className: "text-black bg-white"
                // variant: "destructive"\
            })

        }


        if (result?.url) {
            router.replace('dashboard')
        }
        setIsSubmitting(false);
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className=" text-center">
                    <h1 className=" text-4xl font-extrabold 
                    tracking-tight lg:text-5xl mb-6"> Join Mystery Message</h1>
                    <p className="mb-4">
                        Sign in to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email / username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : ('sign in')
                            }
                        </Button>
                    </form>
                </Form>
                <div className=" flex  justify-center">
                    <p>
                        Don't have account?{' '}
                        <Link href={"/sign-up"} className="text-blue-600
                         hover:text-blue-800 ">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page
