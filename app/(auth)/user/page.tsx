import SignUpForm from '@/components/auth/sign-up-form';
import Link from 'next/link'
import React from 'react'

function SignUp() {
    return (
        <div className='flex min-h-screen'>
            <div className="hidden lg:flex flex-1/2 bg-[url(/sign-up-gradient.jpg)] bg-cover bg-center"></div>
            <div className="flex flex-col flex-1/2 p-4 gap-y-4">
                <div className='lg:w-3/4 m-auto w-4/5'>
                    <div>
                        <h1 className='lg:text-[2vw] font-medium'>Create an account</h1>
                        <p className='text-sm'>
                            <span>Already have an account?</span>
                            <Link href="/sign-in" className='underline mx-1'>Sign In</Link>
                        </p>
                    </div>
                    <div className='my-5'>
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp