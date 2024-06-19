import * as React from "react"
import { Check, Plus, Send } from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/Providers/AuthContext"
import { useState } from "react"
import { useRooms } from "@/Providers/RoomsContext"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"


interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    dateOfCreation: string;
    avatarUrl?: string | null;
    isGoogle?: boolean | null;
    isGithub?: boolean | null;
  }


export function InviteMember() {
    const { t } = useTranslation();
    const { toast } = useToast()
    const [open, setOpen] = React.useState(false)
    const { idRoom } = useParams();
    const { users } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const { inviteUser, getRoomUsers } = useRooms();
    const [input, setInput] = React.useState("")
    const inputLength = input.trim().length;

    const handleSelect = (clickedUser: User) => {
        const isSelected = selectedUsers.some(user => user.id === clickedUser.id);
    if (isSelected) {
      setSelectedUsers(prevSelectedUsers =>
        prevSelectedUsers.filter(user => user.id !== clickedUser.id)
      );
    } else {
      setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, clickedUser]);
    }
    };

    const handleInvite = async (selectedOnes: User[]) => {
        try {
          const currentDate = new Date();
          const invitePromises = selectedOnes.map(selectedOne => {
            const requestInvitation: InviteUserDto = {
              roomId: idRoom,
              userId: selectedOne.id,
              joinedAt: currentDate,
              isAdmin: false
            };
            return inviteUser(requestInvitation);
          });
          await Promise.all(invitePromises);
          console.log('Invitations sent successfully.');
        } catch (error) {
          console.error('Error sending invitations:', error);
          throw error;
        }
      };

    return (
        <>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            className="ml-auto rounded-lg"
                            onClick={() => setOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">{t("Invite member")}</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={10}>{t("Invite member")}</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="gap-0 p-0 outline-none">
                    <DialogHeader className="px-4 pb-4 pt-5">
                        <DialogTitle>{t("Invite member")}</DialogTitle>
                        <DialogDescription>
                            {t("Invite a user to this room.")}
                        </DialogDescription>
                    </DialogHeader>
                    <Command className="overflow-hidden rounded-t-none border-t">
                        <CommandInput placeholder={`${t("Search user")}...`} />
                        <CommandList>
                            <CommandEmpty>{t("No member found.")}</CommandEmpty>
                            <CommandGroup className="p-2">
                                {users.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        className="flex items-center px-2"
                                        onSelect={() => handleSelect(user)}
                                    >
                                        <Avatar>
                                            <AvatarImage src={user.avatarUrl} alt="Image" />
                                            <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-2">
                                            <p className="text-sm font-medium leading-none">
                                                {user.firstName + " " + user.lastName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                        {selectedUsers.includes(user) ? (
                                            <Check className="ml-auto flex h-5 w-5 text-primary" />
                                        ) : null}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
                        {selectedUsers.length > 0 ? (
                            <div className="flex -space-x-2 overflow-hidden">
                                {selectedUsers.map((user) => (
                                    <Avatar
                                        key={user.id}
                                        className="inline-block border-2 border-background"
                                    >
                                        <AvatarImage src={user.avatarUrl} />
                                        <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {t("Select a member to add to this room.")}
                            </p>
                        )}
                        <Button
                            disabled={selectedUsers.length < 1}
                            onClick={() => {
                                handleInvite(selectedUsers)
                                setOpen(false);
                                toast({
                                    description: `${selectedUsers.length} users joined.`
                                  })
                            }}
                        >
                            {t("Continue")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}