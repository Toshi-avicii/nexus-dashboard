import SignUpForm from '@/components/auth/sign-up-form'
import Link from 'next/link'
import React from 'react'

function SignUpPage() {
    return (
        <div className='flex min-h-screen'>
            <div className="hidden lg:flex flex-1/2 bg-[url(https://images.unsplash.com/photo-1633596683562-4a47eb4983c5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1332)] bg-cover bg-center"></div>
            <div className="flex flex-col flex-1/2 p-4 gap-y-4">
                <div className='lg:w-3/4 m-auto w-4/5'>
                    <div>
                        <h1 className='lg:text-[2vw] font-medium font-quickSand'>Create an account</h1>
                        <p className='text-sm'>
                            <span className="font-quickSand">Already have an account?</span>
                            <Link href="/user/sign-in" className='underline mx-1 font-notoSans'>Sign In</Link>
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

export default SignUpPage