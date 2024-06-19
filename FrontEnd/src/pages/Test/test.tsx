




import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable"
import { TooltipProvider } from "../../components/ui/tooltip"

import { AppBar, Typography } from "@material-ui/core"



const defaultLayout = [265, 440, 655]






export default function Test() {








  return (
    <>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-screen max-h-screen items-stretch"
        >


          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]}>
            <div >


              <AppBar position="static" color="inherit">
                <Typography variant="h2" align="center">Video Chat</Typography>
              </AppBar>

            </div>
          </ResizablePanel>
          {/* END Display Panel DM*/}
        </ResizablePanelGroup>
      </TooltipProvider>
    </>
  )
}
