"use client"
import axiosInstance from '@/apiConfig';
import { Input } from "@/components/ui/input";
import Cookies from 'js-cookie'; // Import js-cookie library
import * as React from "react";
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUpFailure, signUpRequest, signUpSuccess } from './Actions/authActions';


import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';


const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
})
interface RootState {
  signUp: {
    loading: boolean;
    error: string | null;
    data: any; // adjust the type according to your data structure
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phoneNumber: string;
  dateOfBirth: string;
}
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SignupForm({ className, ...props }: UserAuthFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  const dispatch = useDispatch();
  const signUpState = useSelector((state: RootState) => state.signUp);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    phoneNumber: '',
    dateOfBirth: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userFromCookie = Cookies.get('user');
    console.log('User from cookie:', userFromCookie);
    if (userFromCookie) {
      console.log('User found in cookie. Redirecting to home page...');
      
    } else {
      console.log('User not found in cookie.');
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(signUpRequest(formData));
      console.log('Sign Up Response:', response.data); // Log the resolved data from the response
      if (response && response.data) {
        Cookies.set('user', JSON.stringify(response.data), { expires: 7 }); // Set cookie with expiration date
        console.log('User data stored in cookie:', response.data);
        dispatch(signUpSuccess(response.data));
      } else {
        dispatch(signUpFailure('An error occurred'));
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        phoneNumber: '',
        dateOfBirth: ''
      });
    } catch (error) {
      console.error('Error registering user:', error);
      dispatch(signUpFailure(error));
    }
  };


  const handleContinueWithGithub = async () => {
    try {
      const response = await axiosInstance.post('/api/continue_with_github');
      console.log('GitHub authentication successful:', response.data);
      window.location.href = response.data;
      navigate("/login")
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
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(`/api/githubRedirect?code=${code}`);
          console.log('User data:', response.data);
          // Handle the user data as needed
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <div className="flex flex-row justify-between gap-3">
              <div className="grid gap-1 w-full">
                <Label className="mb-1 ml-1" htmlFor="firstName">
                  {t("First name")}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  name='firstName'
                  placeholder="Fisrt Name"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-1 w-full">
                <Label className="mb-1 ml-1" htmlFor="lastName">
                  {t("Last name")}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  name='lastName'
                  placeholder="Last Name"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-row justify-between gap-3">
              <div className="grid gap-1 w-full">
                <Label className="mb-1 ml-1" htmlFor="phoneNumber">
                  {t("Phone number")}
                </Label>
                <Input
                  id="phoneNumber"
                  type="number"
                  name='phoneNumber'
                  placeholder="+212 6 xxxxxxxx"
                  autoCapitalize="none"
                  maxLength={12}
                  minLength={12}
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-1 w-full">
                <Label className="mb-1 ml-1" htmlFor="dateOfBirth">
                  {t("Date of birth")}
                </Label>
                <Input
                  className="w-full flex justify-items-stretch"
                  id="dateOfBirth"
                  type="date"
                  name='dateOfBirth'
                  max="2008-12-31"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid gap-1 w-full">
              <Label className="mb-1 ml-1" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                name='email'
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1 w-full">

              <Label className=" mb-1 ml-1" htmlFor="password">
                {t("Password")}
              </Label>
              <Input
                id="password"
                minLength={6}
                placeholder=""
                name='password'
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1">

              <Label className=" mb-1 ml-1" htmlFor="passwordConfirmation">
                {t("Password confirmation")}
              </Label>
              <Input
                id="passwordConfirmation"
                minLength={6}
                name='passwordConfirmation'
                placeholder=""
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                value={formData.passwordConfirmation}
                onChange={handleChange}
              />
            </div>
            <Button disabled={isLoading} type="submit">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("Sign up with Email")}
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
