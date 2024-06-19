import { useAuth } from "@/Providers/AuthContext"
import { useRooms } from "@/Providers/RoomsContext"
import { cn } from "@/lib/utils"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { Search } from "lucide-react"
import { ComponentProps, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Separator } from "../../components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import { AddRoomModel } from "./Models/addRoomModel"
import { AnimatePresence, motion } from "framer-motion"
import { useRoomSockets } from "@/Providers/Rooms_SocketsContext"
import { useTranslation } from "react-i18next"

import {  Result } from 'react-leaf-polls'
import 'react-leaf-polls/dist/index.css'

// Persistent data array (typically fetched from the server)
/*const resData = [
  { text: 'Answer 1', votes: 0 },
  { text: 'Answer 2', votes: 0 },
  { text: 'Answer 3', votes: 0 }
]*/

// Object keys may vary on the poll type (see the 'Theme options' table below)
/*const customTheme = {
  textColor: 'black',
  mainColor: '#00B87B',
  backgroundColor: 'rgb(255,255,255)',
  alignment: 'center'
}*/



interface MiddlePanelItems {
}


export function Middle_Panel({ }: MiddlePanelItems) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roomsAndRoles, usersAndRoles, getUserRooms, getRoomUsers, addRoom } = useRooms();
  const [selected, setSelected] = useState();
  const sortedRooms = roomsAndRoles?.sort((a, b) => new Date(b.room.createdAt) - new Date(a.room.createdAt));
  const [tabValue, setTabValue] = useState("all");
  const { subscribeToRoom } = useRoomSockets();

  useEffect(() => {
    if (user?.id) {
      getUserRooms(user.id);
    }
  }, [user]);

  const getFilteredRooms = () => {
    if (tabValue === "all") {
      return sortedRooms;
    } else if (tabValue === "myRooms") {
      return sortedRooms?.filter(item => item.isAdmin);
    }
    return [];
  };


  function getRoomAdmin(idRoom: any) {
    throw new Error("Function not implemented.")
  }

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center px-4 py-2 justify-between">
        {/* Title Panel 2 */}
        <h1 className="text-xl font-bold">Rooms</h1>
        <div className="flex items-center gap-1">
          <TabsList className="ml-auto">
            <TabsTrigger
              value="all"
              className="text-zinc-600 dark:text-zinc-200"
              onClick={() => setTabValue("all")}
            >
              {t("All")}
            </TabsTrigger>
            <TabsTrigger
              value="myRooms"
              className="text-zinc-600 dark:text-zinc-200"
              onClick={() => setTabValue("myRooms")}
            >
              {t("My Rooms")}
            </TabsTrigger>
          </TabsList>
          <AddRoomModel />
        </div>
      </div>
      <Separator />
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={`${t("Search")}...`} className="pl-8" />
          </div>
        </form>
      </div>

      {/* Panel 2 Content */}
      <AnimatePresence>
        {/* ALL ROOMS */}
        <TabsContent value={tabValue} className="m-0">
          <ScrollArea className="h-screen">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {getFilteredRooms()?.map(item => (
                <motion.div
                  key={item.roomId}
                  layout
                  initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.01 },
                    layout: {
                      type: "spring",
                      bounce: 0.2,
                      duration: item.roomId * 0.001 + 0.1,
                    },
                  }}
                  style={{
                    originX: 0.5,
                    originY: 0.5,
                  }}
                  className=""
                >
                  <button
                    className={cn(
                      "w-full flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                      selected === item.roomId && "bg-muted"
                    )}
                    onClick={() => {
                      setSelected(item.roomId);

                      navigate(`/rooms/${item.roomId}`);
                    }}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="font-extrabold text-lg">{item.room.name}</div>
                          {item.isAdmin && (
                            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "ml-auto text-xs",
                          )}
                        >
                          {formatDistanceToNow(new Date(item.room.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                      <div className="text-xs font-medium">{item.roomId}</div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {item.room.description.substring(0, 300)}
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </AnimatePresence>
    </Tabs>

  )
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}
