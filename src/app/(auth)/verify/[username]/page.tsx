'use client'
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form"
import { FormField } from "@/components/ui/form"
import { FormItem } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const page = () => {

    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    //zod form 
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)

    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {

            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: response?.data?.message,
                // variant: "default"
                className: "text-black bg-white"
            })

            router.replace('/sign-in')

        } catch (error) {
            console.error("Error in sign up of user", error);
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "verification Failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100 text-black'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white
             rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className=' text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'> Verify Your Account</h1>
                    <p className='mb-4'> Enter the verification code sent to your email</p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                // idr name = username pr error dega kyuki verify mai username hai hi nhi just code hai
                                // .jo humne zod se verify krva rkha hai verifySchema se 
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verify Your Account</FormLabel>
                                        <FormControl>
                                            <Input placeholder="verification code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default page
