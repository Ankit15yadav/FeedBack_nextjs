'use client'
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod'

const page = () => {

    const router = useRouter();
    const param = useParams<{ username: string }>();
    const { toast } = useToast();

    //zod form 
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)

    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

    }
    return (
        <div>
            Verify account
        </div>
    )
}

export default page
