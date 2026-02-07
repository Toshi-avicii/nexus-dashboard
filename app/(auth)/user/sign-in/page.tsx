'use client';

import { generatePasswordConditions } from '@/components/auth/sign-up-form';
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { login } from '@/helpers/auth.helpers';
import { useAppDispatch } from '@/store/reduxHooks';
import { saveToken } from '@/store/slices/auth.slice';
import { changeProfileWhenSignIn } from '@/store/slices/profile.slice';
import { SignInFormData } from '@/types/auth.types';
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { CircleCheck, CircleX, Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { z } from 'zod';

const signInFormSchema = z.object({
    email: z.string().trim().email('Email must be valid'),
    password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters long")
        .max(20, { message: "Password cannot be longer than 20 characters" })
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

function SignIn() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [formData] = useState<SignInFormData>({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        values: {
            email: formData.email,
            password: formData.password
        },
        mode: "onTouched"
    });

    const loginMutation = useMutation({
        mutationFn: login,
        onMutate() {
            toast.loading('Sending...', { id: 'loading-toast' });
        },
        onSuccess: async(data) => {
            if(data) {
                const { data: result } = data;
                dispatch(changeProfileWhenSignIn({
                    _id: result.data.user._id,
                    dp: '',
                    email: result.data.user.email,
                    phone: result.data.user.phone,
                    role: result.data.user.role,
                    username: result.data.user.username
                }));        
                toast.dismiss("loading-toast"); 
                router.replace('/admin/dashboard');
            }
        },
        onError: (err) => {
            if(err instanceof Error) {
                toast.dismiss('loading-toast');
                toast.error(err.message);
            }
        }
    })

    const onSubmit = (data: z.infer<typeof signInFormSchema>) => {
        loginMutation.mutate(data);
    }

    return (
        <div className='flex min-h-screen justify-center items-center'>
            <div
                className="min-w-screen bg-[url(/sign-in.jpg)] bg-cover bg-center -z-1 absolute w-full h-full bg-gray-800/50"
            />
            <Card className="w-full max-w-sm">
                <CardHeader className='font-quickSand'>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Link href="/">
                            <Button variant="link" className='font-semibold cursor-pointer'>Sign Up</Button>
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {/* email */}
                        <Controller
                            control={form.control}
                            name='email'
                            render={({ field, fieldState }) => {
                                return (
                                    <div className="flex flex-col gap-6 font-quickSand">
                                        <div className="grid gap-2">
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        {...field}
                                                        id="email"
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        required
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    <InputGroupAddon>
                                                        <Mail className={clsx(fieldState.invalid && 'text-red-400')} />
                                                    </InputGroupAddon>
                                                    {
                                                        fieldState.isTouched && (
                                                            <InputGroupAddon
                                                                align="inline-end"
                                                                className={clsx(fieldState.invalid ? 'text-red-400' : 'text-green-500')}
                                                            >
                                                                {
                                                                    fieldState.invalid ? <CircleX /> : <CircleCheck />
                                                                }
                                                            </InputGroupAddon>
                                                        )
                                                    }
                                                </InputGroup>
                                            </Field>
                                        </div>
                                    </div>
                                )
                            }}
                        />

                        {/* password */}
                        <Controller
                            name='password'
                            control={form.control}
                            render={({ field, fieldState }) => {
                                return (
                                    <Field data-invalid={fieldState.invalid} className='font-quickSand'>
                                        <div className='flex justify-end items-center'>
                                            <FieldLabel htmlFor='form-password' className='font-semibold flex-1'>Password</FieldLabel>
                                            <Button
                                                variant="ghost"
                                                className='text-black'
                                                type='button'
                                                onClick={() => setShowPassword(prev => !prev)}
                                            >
                                                {
                                                    showPassword ? <>
                                                        <EyeOff />
                                                        <span>Hide</span>
                                                    </> : <>
                                                        <Eye />
                                                        <span>Show</span>
                                                    </>
                                                }
                                            </Button>
                                        </div>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                autoComplete='off'
                                                type={showPassword ? 'text' : 'password'}
                                                id='form-password'
                                                aria-invalid={fieldState.invalid}
                                                placeholder='Your password'
                                            />
                                            <InputGroupAddon>
                                                <KeyRound className={clsx(fieldState.invalid && 'text-red-400')} />
                                            </InputGroupAddon>
                                            {
                                                fieldState.isTouched && (
                                                    <InputGroupAddon
                                                        align="inline-end"
                                                        className={clsx(fieldState.invalid ? 'text-red-400' : 'text-green-500')}
                                                    >
                                                        {
                                                            fieldState.invalid ? <CircleX /> : <CircleCheck />
                                                        }
                                                    </InputGroupAddon>
                                                )
                                            }
                                        </InputGroup>
                                        <div className='flex gap-4 flex-wrap'>
                                            {
                                                generatePasswordConditions(field.value).map(condition => {
                                                    return (
                                                        <div
                                                            className={clsx('text-sm flex gap-1 items-center', condition.condition ? 'text-green-500' : 'text-red-500')}
                                                            key={condition.label}
                                                        >
                                                            <span className={
                                                                clsx('w-2 h-2 rounded-full inline-block', condition.condition ? 'bg-green-400' : 'bg-red-400')
                                                            }></span>
                                                            {condition.label}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Field>
                                )
                            }}
                        />

                        <div className='font-quickSand mt-4'>
                            <Button 
                                type="submit" 
                                disabled={!form.formState.isValid} 
                                className="w-full cursor-pointer"
                            >
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignIn