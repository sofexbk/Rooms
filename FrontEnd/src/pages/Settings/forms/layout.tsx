"use client";
import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useTranslation } from "react-i18next";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "Account",
    href: "/settings/account",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
  {
    title: "Display",
    href: "/settings/display",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode; 
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { t } = useTranslation();
  return (
    <>
     
      <div className="hidden md:block ">
        <div className="space-y-0.5 p-6">
          <h2 className="text-3xl font-bold tracking-tight">{t("Settings")}</h2>
          <p className="text-muted-foreground">
            {t("Manage your account settings and set e-mail preferences.")}
          </p>
        </div>
        <Separator />
        <div className="flex flex-col  lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className=" lg:w-1/5 flex w-full h-screen justify-between">
            <SidebarNav items={sidebarNavItems} />
            <Separator orientation="vertical" />
          </aside>
          
          <div className="flex-1 lg:max-w-2xl pt-6">{children}</div>
         
          
        </div>
      </div>
    </>
  )
}
