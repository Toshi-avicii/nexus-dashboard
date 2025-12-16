'use client';

import { useAppDispatch, useAppSelector } from '@/store/reduxHooks'
import Image from 'next/image';
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/helpers/auth.helpers';
import { toast } from 'sonner';
import { removeProfile } from '@/store/slices/profile.slice';
import { useRouter } from 'next/navigation';

function ProfileDropdown() {
    const profile = useAppSelector(state => state.profile);
    const usernameArr = profile.username.split(" ");
    const dispatch = useAppDispatch();
    const router = useRouter();

    const logoutMutation = useMutation({
        mutationFn: logout,
        onMutate() {
            toast.loading('Sending...', { id: 'loading-toast' });
        },
        onSuccess: async (data) => {
            dispatch(removeProfile());
            toast.dismiss("loading-toast");
            router.replace('/user/sign-in');
        },
        onError: (err) => {
            toast.dismiss('loading-toast');
            toast.error(err.message);
        }
    });

    const handleLogout = (evt: React.MouseEvent<HTMLDivElement>) => {
        logoutMutation.mutate();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                {
                    profile.dp ? <Image src={profile.dp} alt={profile.username} className='w-4 h-4 rounded-full' /> :
                        <div className='rounded-full flex justify-center items-center'>
                            <div
                                className='bg-blue-200 p-2 cursor-pointer uppercase font-bold text-sm font-quickSand tracking-wide text-blue-700 rounded-full'
                            >
                                {usernameArr.length > 1 ? `${usernameArr[0][0]}${usernameArr[1][0]}` : usernameArr[0].slice(0, 2)}
                            </div>
                        </div>
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent className='font-quickSand'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer'>
                    <Link href='/profile'>
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProfileDropdown