"use client"
import { useAuth } from '@/Providers/AuthContext';
import axiosInstance from '@/apiConfig';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from "sonner";
//import { z } from "zod";



/*const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
})*/
//let err: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined = null;
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/api/login', loginData);
      const Data = response.data;
      const userData = Data.user;
      const accessToken = Data.accessToken;
      if (response && response.data) {
        login(userData, accessToken);
      }
      navigate('/profile');
    } catch (error) { toast.warning((error as { response?: { data?: string } }).response?.data ?? 'An error occurred. Please try again.'); }

  };
  
  const handleContinueWithGithub = async () => {
    try {
      const response = await axiosInstance.post('/api/continue_with_github');
      console.log('GitHub authentication successful:', response.data);
      window.location.href = response.data;     
    } catch (error) {
      console.error('Error authenticating with GitHub:', error);
    }
  };

  const handleContinueWithGoogle = async () => {
    try {
      const response = await axiosInstance.post('/api/continue_with_google');
      console.log('Google authentication successful:', response.data);
      window.location.href = response.data;
    } catch (error) {
      console.error('Error authenticating with Google:', error);
    }
  };

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="mb-1 ml-1" htmlFor="email">
                Email
              </Label>
              <Toaster />
              <input 
              id="email"
              type="email" 
              name="email" 
              placeholder="Email" 
              value={loginData.email} 
              onChange={handleLoginChange} 
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50' 
              />

            </div>
            <div className="grid gap-1">
              <div className="flex flex-row items-center justify-between">
                <Label className=" ml-1" htmlFor="password">
                  {t("Password")}
                </Label>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button asChild variant="link"><a href="/reset">{t("Forget your password ?")}</a></Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/vercel.png" />
                        <AvatarFallback>RP</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{t("Reset your password")}</h4>
                        <p className="text-sm">
                          {("Please enter your email.")}
                        </p>
                        <p className="text-sm">
                          {t("We will send you a link to reset it.")}
                        </p>
                        <div className="flex items-center pt-2">
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                          <span className="text-xs text-muted-foreground">
                            {t("Restoring within 15 min")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <input id="password" type="password" minLength={6} name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'  />
            </div>
            
            <Button disabled={isLoading} onClick={handleLogin} className="">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("Login with Email")}
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("Or continue with")}
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-3">
          <a className="w-full">
            <Button variant="outline" type="button" className="w-full" disabled={isLoading} onClick={handleContinueWithGoogle}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}{" "}
              Google
            </Button>
          </a>


          <a className="w-full">
            <Button variant="outline" className="w-full" type="button" disabled={isLoading} onClick={handleContinueWithGithub}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" />
              )}{" "}
              GitHub
            </Button>
          </a>
        </div>
      </div>
    </>
  )
}
