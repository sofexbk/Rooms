import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircleMore, Unlink, UsersRound } from "lucide-react"
import * as React from "react"

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
    Dialog
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InviteMember } from "./invitemember"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect } from "react"
import { useRooms } from "@/Providers/RoomsContext"
import { useParams } from "react-router-dom"
import { useAuth } from "@/Providers/AuthContext"


import { useTranslation } from "react-i18next"
import { formatDistanceToNow } from "date-fns"

interface UnlinkUserDto {
    userId: number;
    roomId: number;
}

export function MembersList() {
    const { toast } = useToast()
    const { idRoom } = useParams();
    const [open, setOpen] = React.useState(false)
    //const [selectedUsers, setSelectedUsers] = React.useState<User[]>([])
    const { usersAndRoles, roomAdmin, getRoomUsers,  getRoomAdmin,  unlinkUser } = useRooms();
    //const [input, setInput] = React.useState("")
    const { user } = useAuth();
    //const inputLength = input.trim().length
    const { t } = useTranslation();
    
    useEffect(() => {

    }, []);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen} >
                <Sheet>
                    <SheetTrigger>
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => { setOpen(true); getRoomUsers(idRoom); getRoomAdmin(idRoom) }}>
                                        <UsersRound className="h-4 w-4" />
                                        <span className="sr-only">{t("Members")}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={10}>{t("Members")}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col gap-3">
                        <SheetHeader >
                            <div className="flex">
                                <SheetTitle>{t("Members")}</SheetTitle>
                                <InviteMember />
                            </div>
                            <SheetDescription className="">
                                {t("Here you can see all Rooms members.")}
                            </SheetDescription>
                        </SheetHeader>
                        <Command className="rounded-t-none border-t w-full h-full gap-3">
                            <CommandInput placeholder={`${t("Search")}...`} />
                            <CommandList className="h-full ">
                                <CommandEmpty>{t("No member found.")}</CommandEmpty>
                                <CommandGroup className="h-full">
                                    {usersAndRoles?.map((userAndRole) => (
                                        <CommandItem
                                            key={userAndRole.user.id}
                                            className="flex items-center justify-between p-2"
                                        >
                                            <div className="flex">
                                                <Avatar>
                                                    <AvatarImage src={userAndRole.user.avatarUrl} alt="Image" />
                                                    <AvatarFallback>{userAndRole.user.firstName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="ml-2 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {userAndRole.user.firstName + " " + userAndRole.user.lastName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Joined 
                                                        {" "+ formatDistanceToNow(new Date(userAndRole.joinedAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 items-center ">
                                                {userAndRole.isAdmin && <p className="text-xs border-2  rounded-full p-1 px-2 bg-green-500 text-white">{t("Admin")}</p>}
                                                {userAndRole.user.id != user?.id && // You can't message yourself
                                                    <TooltipProvider delayDuration={0}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="outline" size="icon" >
                                                                    <MessageCircleMore className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent sideOffset={10}>{t("Message")}</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                }
                                                {(roomAdmin === user?.id) && (!userAndRole.isAdmin) &&  // Si le profil connecté est celui l'Admin du room correspodante (via roomid by useParams) donc He can unlink // L'admin ne peut pas etre unliked whataver the situation is 
                                                    <TooltipProvider delayDuration={0}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="outline" size="icon"
                                                                    onClick={() => {
                                                                        const request: UnlinkUserDto = {
                                                                            userId: userAndRole.user.id,
                                                                            roomId: idRoom
                                                                        };
                                                                        unlinkUser(request)
                                                                        toast({
                                                                            description: `${userAndRole.user.firstName} unlinked.`
                                                                          })
                                                                    }}
                                                                >
                                                                    <Unlink className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent sideOffset={10}>{t("Unlink")}</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                }

                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>

                    </SheetContent>
                </Sheet>

            </Dialog>
        </>
    )
}