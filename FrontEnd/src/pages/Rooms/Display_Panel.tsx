import {
  MoreVertical,
  PhoneCall,
  Send
} from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useAuth } from "@/Providers/AuthContext"
import { useRooms } from "@/Providers/RoomsContext"
import { useRoomSockets } from "@/Providers/Rooms_SocketsContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import translateMessage from "@/services/translateMessage"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import axios from "axios"
import { format, formatDistanceToNow, isToday } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from 'react-router-dom'
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { MembersList } from "./Models/Members/memberslist"
import { EditRoomModel } from "./Models/editRoomModel"
import { VideoCall } from "./Models/videocall"



const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

interface DashboardDisplayProps {

}

interface RoomMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export function Display_Panel({ }: DashboardDisplayProps) {

  const { t } = useTranslation();
  const { toast } = useToast()
  const { user, users, getUserName, getUserAvatar } = useAuth();
  const { idRoom } = useParams();
  const { roomsAndRoles, roomAdmin, getRoomAdmin, deleteRoom } = useRooms();
  const [isEditRoomModelOpen, setIsEditRoomModelOpen] = useState(false);
  const oneRoom = roomsAndRoles?.find(item => item.roomId.toString() === idRoom) || null; //Security check hna kayen to verify if the room bemongs to user awla no

  useEffect(() => {
    getRoomAdmin(idRoom)
    subscribeToRoom(idRoom?.toString()); // hna where kan subscribe to the room once display message kayen
  }, [oneRoom, idRoom]);

  const handleEditClick = () => {
    setIsEditRoomModelOpen(true);
  };

  // ROOM MESSAGE
  const { subscribeToRoom } = useRoomSockets();
  const { sendMessage, IncomingMessage: IncomingMessage } = useRoomSockets();
  const [content, setContent] = useState<string>('');
  const [roomMessages, setRoomMessages] = useState<RoomMessage[]>([]);

  const handleSendMessage = () => {
    if (user && idRoom) {
      sendMessage(user.id.toString(), idRoom.toString(), content);
    }
    setContent('')
  };

  // Show tomporaiaremnt dok les messages incoming before any refresh page
  useEffect(() => {
    setRoomMessages(prevMessages => prevMessages.concat(IncomingMessage || []));
  }, [IncomingMessage]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const fetchChatMessages = async (roomId: string): Promise<any> => {
    try {
      const response = await axios.get(`http://localhost:8081/messages/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
    }
  };

  // Message Translator
  const [from, setFrom] = useState('en');
  const [to, setTo] = useState('fr');

  const handleTranslate = async (inputText: string): Promise<void> => {
    const translatedText = await translateMessage(inputText, from, to);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && idRoom) {
          const data = await fetchChatMessages(idRoom.toString());
          setRoomMessages(data)
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };
    fetchData();
  }, [user, idRoom]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [roomMessages]);

  const handleCopy = (textToCopy: string) => {
    // Create a temporary textarea element to copy the message content
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    toast({
      description: "Message copied."
    })
  };

  // Pool
  const [goal, setGoal] = React.useState(1)
  function onClick(adjustment: number) {
    setGoal(Math.max(1, Math.min(10, goal + adjustment)))
  }

  return (
    <div className="flex flex-col h-screen">

      {/* IF THERE IS ANY ITEM SELECTED */}
      {oneRoom ? (
        <>
          <div className="flex items-center p-2">
            <div className="flex items-center gap-2 text-lg font-bold ml-3">
              {oneRoom?.room.name}
            </div>


            <div className="ml-auto flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!oneRoom}>
                    <PhoneCall className="h-4 w-4" />
                    <span className="sr-only">{t("Call")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("Call")}</TooltipContent>
              </Tooltip>
              <VideoCall />
              <MembersList />

            </div>
            {(roomAdmin === user?.id) &&
              <>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!oneRoom}>
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">{t("More")}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <button onClick={handleEditClick}>
                        {t("Edit")}
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button onClick={() => deleteRoom(oneRoom.roomId)}>
                        {t("Delete")}
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {isEditRoomModelOpen && <EditRoomModel />}
              </>
            }
          </div>
          <Separator />
          {/* BODY - START ROOM MESSAGES */}
          <div className="flex-1 whitespace-pre-wrap p-7 text-sm overflow-y-auto" ref={messagesContainerRef}>
            <AnimatePresence>
              <>
                {roomMessages?.map((message, index) => {
                  const messageDate = new Date(message.timestamp);
                  let formattedDate;

                  if (isToday(messageDate)) {
                    // If the message was sent today, display only hours and minutes
                    formattedDate = format(messageDate, 'HH:mm');
                  } else {
                    // If the message was sent on a different day, include month and day
                    formattedDate = format(messageDate, 'MMMM d HH:mm');
                  }
                  const sender = users?.find(user => user.id.toString() === message.senderId);
                  return (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                      transition={{
                        opacity: { duration: 0.1 },
                        layout: {
                          type: "spring",
                          bounce: 0.3,
                          duration: roomMessages.indexOf(message) * 0.05 + 0.2,
                        },
                      }}
                      style={{
                        originX: 0.5,
                        originY: 0.5,
                      }}
                      className="flex flex-col gap-2 p-2 whitespace-pre-wrap items-start"
                    >
                      <div className="flex gap-5 items-start w-full">
                        <Avatar className="flex justify-center items-center h-6 w-6">
                          <AvatarImage
                            src={sender?.avatarUrl}
                          />
                          <AvatarFallback className="bg-primary-foreground text-secondary-foreground capitalize font-bold" >
                            {(sender?.firstName[0] + sender?.lastName[0])}
                          </AvatarFallback>
                        </Avatar>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex flex-col items-start">
                                <div className="space-x-3">
                                  {message.senderId === user?.id.toString() ? (
                                    <>
                                      <span className="font-bold text-base/6">{t("Me")}</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="font-bold capitalize text-base/6">{sender?.firstName}</span>
                                    </>
                                  )}

                                  <span style={{ fontSize: '9px' }}>{formattedDate}</span>
                                </div>
                                <span
                                  onClick={() => handleCopy(message.content)}
                                  className="text-start py-2 rounded-xl flex flex-row w-full text-wrap pr-8">

                                  {message.content}

                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {formatDistanceToNow(new Date(message.timestamp))} {t("ago")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                      </div>
                    </motion.div>
                  );
                })}
              </>
            </AnimatePresence>
          </div>
          {/* BODY - END ROOM MESSAGES */}

          <div>
            <Separator className="mt-auto" />
            <div className="p-4 flex gap-4 ">
              <Input
                id="message"
                placeholder={`${t("Type your message")}...`}
                className="flex-1 bg-accent"
                autoComplete="off"
                value={content}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent default behavior of Enter key in the input
                    handleSendMessage(); // Call handleSendMessage function when Enter key is pressed
                  }
                }}
              />

             
              {/* START - Poll button */}
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Poll</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>Create poll</DrawerTitle>
                      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => onClick(-1)}
                          disabled={goal <= 1}
                        >
                          <MinusIcon className="h-4 w-4" />
                          <span className="sr-only">Decrease</span>
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="text-7xl font-bold tracking-tighter">
                            {goal}
                          </div>
                          <div className="text-[0.70rem] uppercase text-muted-foreground">
                            Options
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => onClick(+1)}
                          disabled={goal >= 10}
                        >
                          <PlusIcon className="h-4 w-4" />
                          <span className="sr-only">Increase</span>
                        </Button>
                      </div>
                      <div className="mt-3 h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data}>
                            <Bar
                              dataKey="goal"
                              style={
                                {
                                  fill: "hsl(var(--foreground))",
                                  opacity: 0.9,
                                } as React.CSSProperties
                              }
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <DrawerFooter>
                      <Button>Submit</Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
              {/* END- Poll button */}

              <Button size="icon"
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">{t("Send")}</span>
              </Button>
            </div>

          </div>
        </>

      ) : (
        <>
          <div className="p-8 text-center text-muted-foreground">
            {t("No Room selected")}
          </div>
          <BackgroundBeams />
        </>
      )}


    </div>
  )
}
