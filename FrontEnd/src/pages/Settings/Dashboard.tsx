"use client"
import { Sidebar } from "@/components/shared/sidebar"
import * as React from "react"
import { ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable"
import { TooltipProvider } from "../../components/ui/tooltip"
import SettingsLayout from './forms/layout'


interface DashboardRoomsProps {
  defaultLayout: number[] | undefined
  navCollapsedSize: number
  children: React.ReactNode;
}

export function Dashboard({
  children,
  defaultLayout = [265, 440, 655],
  navCollapsedSize,
}: DashboardRoomsProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(true)
  return (
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
            titre="Settings"
          />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={70}>
          <SettingsLayout>{children}</SettingsLayout>
          </ResizablePanel>

        </>


      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
