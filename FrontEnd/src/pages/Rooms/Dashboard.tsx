"use client"
import { Sidebar } from "@/components/shared/sidebar"
import * as React from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable"
import { TooltipProvider } from "../../components/ui/tooltip"
import { Display_Panel } from "./Display_Panel"
import { Middle_Panel } from "./Middle_Panel"

interface DashboardRoomsProps {
  defaultLayout: number[] | undefined
  navCollapsedSize: number
}

export function Dashboard({
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
            titre="Rooms"
          />
        </>

        {/* START Middle Panel ROOMS */}

        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} maxSize={40}>
          <Middle_Panel />
        </ResizablePanel>

        {/* END Middle Panel ROOMS  */}



        {/* START Display Panel ROOMS */}

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <Display_Panel />
        </ResizablePanel>

        {/* END Display Panel ROOMS */}

      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
