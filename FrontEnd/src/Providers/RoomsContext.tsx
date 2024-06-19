import axiosInstance from '@/apiConfigRooms';
import { AxiosResponse } from 'axios';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phoneNumber: string;
  dateOfBirth: string;
  dateOfCreation: string;
  avatarUrl: string | null;
  resetPasswordToken: string | null;
  resetPasswordTokenExpiring: string | null;
  isGoogle: boolean | null;
  isGithub: boolean | null;
}

interface Room {
  Id: number;
  name: string;
  description: string;
  createdAt: Date;
}

interface RoomRole {
  room: Room;
  roomId: number
  isAdmin: boolean;
}

interface UserRole {
  user: User;
  isAdmin: boolean;
  joinedAt: Date;
}

interface RoomCreateDto {
  adminId: number;
  name: string;
  description: string;
}

interface UnlinkUserDto {
  userId: number;
  roomId: number;
}

interface InviteUserDto {
  roomId: number;
  userId: number;
  joinedAt: Date;
  isAdmin: boolean;
}

interface RoomUpdateDto {
  roomId: number;
  name: string;
  description: string;
}


interface RoomsContextType {
  roomsAndRoles: RoomRole[] | undefined;
  usersAndRoles: UserRole[] | undefined;
  roomAdmin: number | undefined;
  getUserRooms: (id: number) => Promise<void>;
  getRoomUsers: (id: number) => Promise<void>;
  getRoomAdmin: (id: number) => Promise<void>;
  addRoom: (requestAddRoom: RoomCreateDto) => Promise<void>;
  inviteUser:(requestInvitation: InviteUserDto) =>Promise<void>;
  unlinkUser:(requestUnlink: UnlinkUserDto) =>Promise<void>;
  updateRoom: (request: RoomUpdateDto) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;
  
}



const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export const RoomsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [roomsAndRoles, setRoomsAndRoles] = useState<RoomRole[]>();
  const [usersAndRoles, setusersAndRoles] = useState<UserRole[]>();
  const [roomAdmin, setRoomAdmin] = useState<number>();
 // const [room, setRoom] = useState<Room>();
  
  // Get ROOMS of 1 User
  const getUserRooms = async (userId: number) => {
    try {
      if (!user) {
        throw new Error('User is not authenticated.'); // Handle this case according to your application logic
      }
      const response = await axiosInstance.get(`/getRooms?userId=${userId}`);
      const roomsAndRolesData = response.data as RoomRole[];
      setRoomsAndRoles(roomsAndRolesData);
    } catch (error) {
      console.error('Error fetching user rooms:', error);
      throw error;
    }
  };
  
  // Get USERS of 1 Room (members)
  const getRoomUsers = async (roomId: number) => {
    try {
      const response = await axiosInstance.get(`/getusers?roomId=${roomId}`);
      const usersAndRolesData = response.data as UserRole[];
      setusersAndRoles(usersAndRolesData);
    } catch (error) {
      console.error('Error fetching room users:', error);
      throw error;
    }
  };

  // Get ADMIN of 1 Room 
  const getRoomAdmin = async (roomId: number) => {
    try {
      const response = await axiosInstance.get(`/getadmin?roomId=${roomId}`);
      const adminId = response.data as number;
      setRoomAdmin(adminId)
    } catch (error) {
      console.error('Error getting room admin:', error);
      throw error;
    }
  };

  // Add new ROOM
  const addRoom = async (requestAddRoom: RoomCreateDto) => {
    try {
      if (!user) {
        throw new Error('User is not authenticated.'); // Handle this case according to your application logic
      }
      await axiosInstance.post('/addroom', requestAddRoom);
      await getUserRooms(user.id); // Ensure to await the getUserRooms call if needed
    } catch (error) {
      console.error('Error adding new room:', error);
      throw error;
    }
  };
  

  // Invite 1 USER
  const inviteUser = async (requestInvitation: InviteUserDto) => {
    try {
      await axiosInstance.post('/addroomuser', requestInvitation)
      getRoomUsers(requestInvitation.roomId) //refresh room users
    } catch (error) {
      console.error('Error inviting room user:', error);
      throw error;
    }
  };

  // Unlink 1 USER
  const unlinkUser = async (requestUnlink: UnlinkUserDto): Promise<void> => {
    try {
      const response: AxiosResponse = await axiosInstance.delete('/unlinkuser', {
        data: requestUnlink
      });
  
      // Example: Check status code or use response.data if needed
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
  
      // Refresh room users after successful unlinking
      getRoomUsers(requestUnlink.roomId);
    } catch (error) {
      console.error('Error unlinking user:', error);
      throw error;
    }
  };

  // Update 1 ROOM
  const updateRoom = async (request: RoomUpdateDto): Promise<void> => {
    try {
      await axiosInstance.put('/updateroom', request);
      console.log('Room updated successfully.');
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  };

  // Delete 1 ROOM
  const deleteRoom = async (roomId: number): Promise<void> => {
    try {
      if (!user) {
        throw new Error('User is not authenticated.'); // Handle this case according to your application logic
      }
      await axiosInstance.delete(`/deleteroom?roomId=${roomId}`);
      getUserRooms(user.id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };


  return (
    <RoomsContext.Provider value={{ roomsAndRoles, usersAndRoles, roomAdmin, getUserRooms, getRoomUsers, getRoomAdmin, addRoom, inviteUser, unlinkUser, deleteRoom, updateRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
