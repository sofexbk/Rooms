import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { format, formatDistanceToNow, isToday } from 'date-fns';
import { AnimatePresence, motion } from "framer-motion";
import {
  MoreVertical,
  PhoneCall,
  Send,
  Video
} from "lucide-react";

import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';

import { useAuth } from '@/Providers/AuthContext';
import { useDMSockets } from '@/Providers/DM_SocketsContext';

import { cn } from "@/lib/utils";
import axios from "axios";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { useTranslation } from "react-i18next";


interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export function Display_Panel({ }) {
  const { t } = useTranslation();
  const { toast } = useToast()
  const { user } = useAuth();
  const { users } = useAuth();
  const { idContact } = useParams();
  const { sendMessage, temporaryIcomingMessage } = useDMSockets();
  const [content, setContent] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const selectedChat = users?.find(item => item.id.toString() === idContact) || null;
  const [isLoading, setIsLoading] = useState(false);
  const [professionalText, setProfessionalText] = useState('');


  const handleSendMessage = () => {
    if (user && idContact) {
      sendMessage(user.id.toString(), idContact, content);
      // only show session messages before refresh page
      const newMessage: ChatMessage = {
        id: "TempId",
        chatId: "TempChatId",
        senderId: user.id.toString(),
        receiverId: idContact,
        content: content,
        timestamp: new Date()
      };
      // adding the new message to the list temporary
      setMessages(prevMessages => [...prevMessages, newMessage]);

    }
    setContent('')
  };

  // Show tomporaiaremnt dok les messages incoming before any refresh page
  useEffect(() => {
    setMessages(prevMessages => prevMessages.concat(temporaryIcomingMessage || []));

  }, [temporaryIcomingMessage]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const fetchChatMessages = async (senderId: string, receiverId: string): Promise<any> => {
    try {
      const response = await axios.get(`http://localhost:8080/messages/${senderId}/${receiverId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && idContact) {
          const data = await fetchChatMessages(user.id.toString(), idContact);
          setMessages(data)
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };
    fetchData();
  }, [user, idContact]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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



  // Create an instance of GoogleGenerativeAI with your API key
  const genAI = new GoogleGenerativeAI('AIzaSyBZEARbh3BT8TdBY0iECP2hJCaRCexeapc');
  const handleButtonClick = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "Make this text looks professional (in the same language) " + "\"" + content + "\""
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setContent(text)
    } catch (error) {
      console.error('Failed to fetch from Gemini AI:', error);
      setProfessionalText('Failed to process your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const AceternityLogo = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bot-message-square"><path d="M12 6V2H8" /><path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" /><path d="M2 12h2" /><path d="M9 11v2" /><path d="M15 11v2" /><path d="M20 12h2" /></svg>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen" >

        {/* IF THERE IS A CHAT SELECTED */}
        {selectedChat ? (
          <>
            {/* START HEADER */}
            <div className="flex items-center p-2">
              <Avatar>
                <AvatarImage src={`${selectedChat.avatarUrl}`} alt="profilePicture" />
                <AvatarFallback className="bg-primary-foreground text-secondary-foreground  font-bold" >
                  {(selectedChat.firstName[0] + selectedChat.lastName[0])}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 text-lg font-bold ml-3">
                {selectedChat.firstName + " " + selectedChat.lastName}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!selectedChat}>
                      <PhoneCall className="h-4 w-4" />
                      <span className="sr-only">{t("Call")}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("Call")}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!selectedChat}>
                      <Video className="h-4 w-4" />
                      <span className="sr-only">{t("Video call")}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("Video call")}</TooltipContent>
                </Tooltip>

              </div>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!selectedChat}>
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">{t("More")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                  <DropdownMenuItem>Star thread</DropdownMenuItem>
                  <DropdownMenuItem>Add label</DropdownMenuItem>
                  <DropdownMenuItem>Mute thread</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* END HEADER */}
            <Separator />

            {/* START BODY */}
            <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col py-1" >
              <div
                className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col px-10"
                ref={messagesContainerRef}
              >
                {/* BODY - START MESSAGES */}
                <AnimatePresence>
                  {messages?.map((message, index) => {
                    const messageDate = new Date(message.timestamp);
                    let formattedDate;

                    if (isToday(messageDate)) {
                      // If the message was sent today, display only hours and minutes
                      formattedDate = format(messageDate, 'HH:mm');
                    } else {
                      // If the message was sent on a different day, include month and day
                      formattedDate = format(messageDate, 'MMMM d HH:mm');
                    }
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
                            duration: messages.indexOf(message) * 0.05 + 0.2,
                          },
                        }}
                        style={{
                          originX: 0.5,
                          originY: 0.5,
                        }}
                        className={cn(
                          "flex flex-col gap-2 p-1 whitespace-pre-wrap ",
                          message.receiverId === user?.id.toString() ? "items-start" : "items-end"
                        )}
                      >
                        <div className="flex gap-2 items-center">
                          {message.receiverId === user?.id.toString() && (
                            <>
                              {/* Pas de photos mn a7ssan 
                            <Avatar className="flex justify-center items-center">
                              <AvatarImage
                                src={selectedChat.avatarUrl?.toString()}
                              />
                              <AvatarFallback className="bg-primary-foreground text-secondary-foreground  font-bold" >
                                {(selectedChat.firstName[0] + selectedChat.lastName[0])}
                              </AvatarFallback>
                            </Avatar>
                            */}
                            </>
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span
                                  onClick={() => handleCopy(message.content)}
                                  className={cn(
                                    " px-3 py-2 rounded-xl max-w-sm flex flex-row gap-3",
                                    message.receiverId === user?.id.toString() ? "items-end rounded-es-none bg-primary-foreground text-accent-foreground" : "items-end bg-primary text-primary-foreground rounded-ee-none"
                                  )}>
                                  {message.content}
                                  <span style={{ fontSize: '9px' }}>{formattedDate}</span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {formatDistanceToNow(new Date(message.timestamp))} {t("ago")}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {message.receiverId !== user?.id.toString() && (
                            <>
                              {/* Pas de photos mn a7ssan 
                            <Avatar className="flex justify-center items-center">
                              <AvatarImage
                                src={user?.avatarUrl?.toString()}
                              />
                            </Avatar>
                             */}
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {/* BODY - END MESSAGES */}
              </div>
            </div>
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




                <div className="flex justify-center text-center">
                  <HoverBorderGradient
                  onClick={handleButtonClick}
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-primary-foreground  text-primary dark:text-white flex items-center space-x-2"
                  >
                    <AceternityLogo />
                    <span><strong>Pro</strong></span> 
                  </HoverBorderGradient>
                </div>

                <Button size="icon"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">{t("Send")}</span>
                </Button>

              </div>
            </div>

            {/* END BODY */}

          </>

        ) : (
          <>
            <div className="p-8 text-center text-muted-foreground">
              {t("No Chat selected")}
            </div>
            <BackgroundBeams />
          </>
        )}


      </div>
    </>
  )
}


