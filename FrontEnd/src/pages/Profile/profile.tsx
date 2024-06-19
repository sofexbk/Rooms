"use client"
import { useAuth } from '@/Providers/AuthContext'
import { Sidebar } from "@/components/shared/sidebar"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { Toaster } from "sonner"
import { ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable"
import { TooltipProvider } from "../../components/ui/tooltip"

import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { useLocation } from "react-router-dom"



interface ProfileProps {
  defaultLayout: number[] | undefined
  navCollapsedSize: number
  children: React.ReactNode;
}

export default function Profile({

  defaultLayout = [265, 440, 655],
  navCollapsedSize,
}: ProfileProps) {
  const { user } = useAuth();
  type UserData = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    dateOfCreation: Date;
    avatarUrl: string;
    isGithub: boolean;
    isGoogle: boolean;
  };
  console.log(user)
  return (
    <>
      
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes
            )}`
          }}
          className="h-screen max-h-screen items-stretch"
        >
          <>
            {/* SideBar*/}
            <Sidebar
              defaultLayout={defaultLayout}
              navCollapsedSize={navCollapsedSize}
              titre="Profile"
            />

            <ResizablePanel defaultSize={defaultLayout[1]} className="h-screen">
              {(user ?
                <div className="">
                  <div className=" h-32 overflow-hidden" >
                   
                    <img className="w-full" src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="" />
                  </div>
                  <div className="flex px-5  -mt-12">

                    {(user.avatarUrl ?
                      <img src={user.avatarUrl} alt="Avatar" width="100" className="h-32 w-32 bg-background p-2 rounded-full" />
                      :
                      <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" width="100" className="rounded-full" />
                    )}
                  </div>

                  <header className="space-y-1.5 ">

                  </header>


                  <div className="space-y-6 px-4 md:px-6 p-16">
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold">Personal Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">First Name</Label>
                          <Input defaultValue={user.firstName} id="name" placeholder="Enter your name" />
                        </div>
                        <div>
                          <Label htmlFor="name">Last Name</Label>
                          <Input defaultValue={user.lastName} id="name" placeholder="Enter your name" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue={user.email} placeholder="Enter your email" type="email" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" defaultValue={user.phoneNumber} placeholder="Enter your phone" type="tel" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold">Change Password</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" placeholder="Enter your current password" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" placeholder="Enter your new password" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <Input id="confirm-password" placeholder="Confirm your new password" type="password" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button size="lg">Save</Button>
                  </div>
                </div>
                : 'No connected user')}
            </ResizablePanel>
          </>
        </ResizablePanelGroup>
      </TooltipProvider>
    </>
  )
}
