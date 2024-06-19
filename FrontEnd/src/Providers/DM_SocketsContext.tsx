"use client"
import { useAuth } from '@/Providers/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

interface TempIncomingChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
}

interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
}

interface SocketsContextType {
    stompClient: Stomp.Client | null;
    sendMessage: (senderId: string, receiverId: string, content: string) => void;
    temporaryIcomingMessage: ChatMessage | null;
}

const DM_SocketsContext = createContext<SocketsContextType | undefined>(undefined);

export const DM_SocketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
    const [temporaryIcomingMessage, setTemporaryIcomingMessage] = useState<ChatMessage | null>(null);
    const { token, user } = useAuth();
    const { toast } = useToast()
    useEffect(() => {
        if (token && user) {
            const socket = new SockJS('http://localhost:8080/ws');
            const stompclient = Stomp.over(socket);
            stompclient.connect({}, () => {
                console.log('Connected to WebSocket');
                setStompClient(stompclient);
                console.log('Stomp Client Setted');
            });
    
            return () => {
                if (stompClient && stompClient.connected) {
                    stompclient.disconnect(() => {
                        console.log('Disconnected from WebSocket');
                    });
                }
            };
        }
    }, [token, user]);
    
    
    // Subscribe to incoming messages
    useEffect(() => {
        if (stompClient && stompClient.connected && user) {
            stompClient.subscribe(`/user/${user.id}/queue/messages`, (message) => {

                const newMessage: TempIncomingChatMessage = JSON.parse(message.body);
                // convert message from the received state to message can be added to message list temporary
                // here to use the notification
                const newtoMessage: ChatMessage = {
                    id: newMessage.id,
                    chatId: "TempChatId",
                    senderId: newMessage.senderId,
                    receiverId: newMessage.receiverId,
                    content: newMessage.content,
                    timestamp: newMessage.timestamp,
                };
                setTemporaryIcomingMessage(newtoMessage);
                toast({
                    title:newMessage.senderId,
                    description: newMessage.content
                  })

            });
            console.log("Subsribed")
        }
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.unsubscribe('/user/public');
            }
        };
    }, [stompClient]);


    const sendMessage = (senderId: string, receiverId: string, content: string) => {
        if (stompClient && stompClient.connected) {
            const message = {
                senderId,
                receiverId,
                content,
            };
            stompClient.send('/app/chat', {}, JSON.stringify(message));
        } else {
            console.error('WebSocket connection not established.');
        }
    };

    return (
        <DM_SocketsContext.Provider value={{ stompClient, temporaryIcomingMessage, sendMessage }}>
            {children}
        </DM_SocketsContext.Provider>
    );
};

export const useDMSockets = () => {
    const context = useContext(DM_SocketsContext);
    if (!context) {
        throw new Error('useSockets must be used within a SocketsProvider');
    }
    return context;
};
