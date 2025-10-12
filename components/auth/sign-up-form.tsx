'use client'

import React, { useState } from 'react'
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../ui/input-group';
import { CircleCheck, CircleX, Eye, EyeOff, KeyRound, Mail, Phone, Send, UserRound } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/button';

interface SignUpFormData {
    username: string;
    email: string;
    phone: string;
    // role: "user" | "admin";
    password: string;
}

const signUpFormSchema = z.object({
    username: z.string().trim().min(3, 'Username must be at least 3 characters long').max(12, {
        message: 'Username connot be longer than 12 characters'
    }),
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
    phone: z.string()
        .min(10, "Phone no. must have at least 10 digits")
        .max(10, "Phone no. cannot have more than 10 digits")
        .regex(/^(?:\+91)?[6-9]\d{9}$/, "Phone no. is invalid"),
});

export const generatePasswordConditions = (password: string) => {
    const conditions = [
        {
            label: "Use 6 or more characters",
            condition: password.length >= 6
        },
        {
            label: "One uppercase character",
            condition: /^(?=.*[A-Z]).+$/.test(password)
        },
        {
            label: "One lowercase character",
            condition: /^(?=.*[a-z]).+$/.test(password)
        },
        {
            label: "One number",
            condition: /^(?=.*[0-9]).+$/.test(password)
        },
        {
            label: "One special character",
            condition: /[^A-Za-z0-9]/.test(password)
        }
    ];

    return conditions;
}

function SignUpForm() {
    const router = useRouter();
    const [formData] = useState<SignUpFormData>({
        email: '',
        password: '',
        username: '',
        phone: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        values: {
            email: formData.email,
            password: formData.password,
            username: formData.username,
            phone: formData.phone
        },
        mode: "onTouched"
    });

    const onSubmit = (data: z.infer<typeof signUpFormSchema>) => {
        console.log({ data });
    }

    return (
        <>
            <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off'>
                <FieldGroup>
                    {/* username */}
                    <Controller
                        name='username'
                        control={form.control}
                        render={({ field, fieldState }) => {
                            return (
                                <div className='grid w-full gap-6'>
                                    <Field data-invalid={fieldState.invalid} className='font-quickSand'>
                                        <FieldLabel htmlFor='form-username' className='font-semibold'>Username</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                id='form-username'
                                                aria-invalid={fieldState.invalid}
                                                placeholder='Enter your name'
                                                autoComplete='off'
                                            />
                                            <InputGroupAddon>
                                                <UserRound
                                                    className={clsx(fieldState.invalid && 'text-red-400')}
                                                />
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
                                        {
                                            fieldState.error && (
                                                <FieldError errors={[fieldState.error]} />
                                            )
                                        }
                                    </Field>
                                </div>
                            )
                        }}
                    />

                    {/* email */}
                    <Controller
                        name='email'
                        control={form.control}
                        render={({ field, fieldState }) => {
                            return (
                                <Field data-invalid={fieldState.invalid} className='font-quickSand'>
                                    <FieldLabel htmlFor='form-email' className='font-semibold'>Email</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            type='email'
                                            id='form-email'
                                            aria-invalid={fieldState.invalid}
                                            placeholder='Enter your email'
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
                                    {
                                        fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )
                                    }
                                </Field>
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

                    {/* phone */}
                    <Controller
                        name='phone'
                        control={form.control}
                        render={({ field, fieldState }) => {
                            return (
                                <Field data-invalid={fieldState.invalid} className='font-quickSand'>
                                    <FieldLabel htmlFor='form-phone' className='font-semibold'>Phone</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            type='tel'
                                            id='form-phone'
                                            aria-invalid={fieldState.invalid}
                                            placeholder='Your Phone no.'
                                        />
                                        <InputGroupAddon>
                                            <Phone className={clsx(fieldState.invalid && 'text-red-400')} />
                                        </InputGroupAddon>
                                        <InputGroupAddon>
                                            <InputGroupText>+91</InputGroupText>
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
                                    {
                                        fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )
                                    }
                                </Field>
                            )
                        }}
                    />
                </FieldGroup>
                <div className='my-6'>
                    <Button
                        type='submit'
                        className='w-full cursor-pointer hover:border hover:border-gray-400 hover:shadow hover:bg-white hover:text-black flex gap-3 transition-all'
                        disabled={!form.formState.isValid}
                    >
                        <Send />
                        <span>
                            Submit
                        </span>
                    </Button>
                </div>
            </form>
        </>
    )
}

export default SignUpForm