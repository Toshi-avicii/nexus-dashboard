'use client';

import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from './ui/sidebar'
import { LayoutDashboard, CircleUserRound, ChevronRight, ShoppingBag } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import Link from 'next/link';
import clsx from 'clsx';

function AppSidebar() {
    const { open } = useSidebar();
    console.log({ open });
    const items = [
        {
            title: "Dashboard",
            url: "/dashboard",
            isActive: true,
            icon: LayoutDashboard,
            style: {
                fontSize: '20px'
            }
        },
        {
            title: "Profile",
            url: "/profile",
            icon: CircleUserRound,
            items: [{
                title: '',
                url: ''
            }]
        }
    ];

    return (
        <Sidebar collapsible='icon' variant='inset'>
            <SidebarHeader className='font-quickSand'>
                <div className={clsx('flex items-center gap-1 px-2', open ? 'flex-row justify-start' : 'flex-col justify-center')}>
                    <ShoppingBag />
                    <span className={clsx('transition-all', open ? 'text-lg' : 'text-xs')}>Nexus</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map((item, index) => {
                            if (item.items && item.items.length > 0) {
                                return (
                                    <Collapsible
                                        key={index}
                                        asChild
                                        defaultOpen={item.isActive}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton asChild tooltip={item.title}>
                                                    <div>
                                                        <item.icon />
                                                        <span className='font-quickSand'>{item.title}</span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </div>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {
                                                        (item.items && item.items.length > 0) && (
                                                            <div>
                                                                {
                                                                    item.items.map((entry, index) => {
                                                                        return (
                                                                            <SidebarMenuSubItem key={index}>
                                                                                <SidebarMenuSubButton asChild>
                                                                                    <Link href={entry.url} className="flex items-center">
                                                                                        <span className='font-quickSand'>{entry.title}    
                                                                                        </span>
                                                                                    </Link>
                                                                                </SidebarMenuSubButton>
                                                                            </SidebarMenuSubItem>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                )
                            } else {
                                return (
                                    <SidebarMenuItem className="flex items-center gap-2" key={index}>
                                        <SidebarMenuButton asChild tooltip={item.title}>
                                            {
                                                !item.url ? <div>
                                                    <item.icon />
                                                    <span className='font-quickSand'>{item.title}</span>
                                                </div> : <Link href={item.url}>
                                                    <item.icon />
                                                    <span className='font-quickSand'>{item.title}</span>
                                                </Link>
                                            }
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            }
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar