"use client"

import { LogOutIcon, LucideIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip"

import { useAuth } from "@/Providers/AuthContext"
import { useNavigate } from 'react-router-dom'

interface NavProps {
  isCollapsed: boolean

  links: {
    title: string
    label?: string
    icon: LucideIcon
    href: string
    variant: "default" | "ghost"
  }[]
}

export function Nav({ links, isCollapsed }: NavProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col py-2 data-[collapsed=true]:py-2 h-screen  justify-between ">
      <nav className=" grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    link.variant === "default" &&
                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4 ">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground ">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start "
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                    "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
      <div className=" m-auto  mb-[8rem]">
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOutIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
