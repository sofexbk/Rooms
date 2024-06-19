"use client"
import { useAuth } from '@/Providers/AuthContext';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


interface RoomMessage {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    timestamp: Date;
}

interface SocketsContextType {
    stompClient: Stomp.Client | null;
    sendMessage: (senderId: string, roomId: string, content: string) => void;
    IncomingMessage: RoomMessage | null;
    subscribeToRoom: (roomId: string) => void;
}

const Rooms_SocketsContext = createContext<SocketsContextType | undefined>(undefined);

export const Rooms_SocketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stompRoomClient, setStompClient] = useState<Stomp.Client | null>(null);
    const [IncomingMessage, setIncomingMessage] = useState<RoomMessage | null>(null);
    const { token, user } = useAuth();

    const subscribeToRoom = (roomId: string) => {
        if (token && user && roomId) {
            const socket = new SockJS('http://localhost:5002/ws');
            const stompClient = Stomp.over(socket);
            stompClient.connect({}, () => {
                console.log('Connected to WebSocket');
                setStompClient(stompClient);

                stompClient.subscribe(`/user/${roomId}/queue/roommessages`, (message) => {
                    const newMessage: RoomMessage = JSON.parse(message.body);
                    setIncomingMessage(newMessage);
                });
            });
        }
    };

    const sendMessage = (senderId: string, roomId: string, content: string) => {
        if (stompRoomClient && stompRoomClient.connected) {
            const message = {
                roomId,
                senderId,
                content,
            };
            stompRoomClient.send('/app/chat', {}, JSON.stringify(message));
        } else {
            console.error('WebSocket connection not established.');
        }
    };

    return (
        <Rooms_SocketsContext.Provider value={{ stompClient: stompRoomClient, IncomingMessage: IncomingMessage, sendMessage, subscribeToRoom }}>
            {children}
        </Rooms_SocketsContext.Provider>
    );
};


export const useRoomSockets = () => {
    const context = useContext(Rooms_SocketsContext);
    if (!context) {
        throw new Error('useSockets must be used within a SocketsProvider');
    }
    return context;
};
