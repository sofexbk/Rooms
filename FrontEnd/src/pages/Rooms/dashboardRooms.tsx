"use client"
import { Search } from "lucide-react"
//import { DashboardDisplay } from "./dashboarddisplay"
//import { MiddlePanelItems } from "./middlePanelItems"
import { Separator } from "../../components/ui/separator"
import { Input } from "../../components/ui/input"
import { TooltipProvider } from "../../components/ui/tooltip"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable"

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import { Sidebar } from "@/components/shared/sidebar"
//import { ModalNewRoom } from "./ModalNewRoom"

interface DashboardRoomsProps {
  defaultLayout: number[] | undefined
  navCollapsedSize: number
}

export function DashboardRooms({
  defaultLayout = [265, 440, 655],
  navCollapsedSize,
}: DashboardRoomsProps) {
 // const [room] = useRoom()
 // const [isCollapsed, setIsCollapsed] = React.useState(true)
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
            defaultLayout = {defaultLayout}
            navCollapsedSize = {navCollapsedSize}
            titre="Rooms"
            />
        </>

        {/* START Panel 2 */}
        
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} maxSize={40}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              {/* Title Panel 2 */}
              <h1 className="text-xl font-bold">Rooms</h1>
              <TabsList className="ml-auto">

                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">All mail</TabsTrigger>
                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">Unread</TabsTrigger>

              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>

            {/* Panel 2 Content */}

            
          </Tabs>
        </ResizablePanel>
        {/* END Panel 2  */}

        {/* START Body Mail*/}
        <ResizableHandle withHandle />

        {/* END Body Mail*/}

      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
