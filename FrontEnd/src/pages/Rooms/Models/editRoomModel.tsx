import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import * as React from "react"

import { useAuth } from "@/Providers/AuthContext"
import { useRooms } from "@/Providers/RoomsContext"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface RoomCreateDto {
    adminId: number;
    name: string;
    description: string;
}

interface RoomUpdateDto {
    roomId: number;
    name: string;
    description: string;
}


export function EditRoomModel() {
    const { t } = useTranslation();
    const { idRoom } = useParams();
    const [open, setOpen] = React.useState(true)
    const { roomsAndRoles, roomAdmin, getRoomAdmin, deleteRoom, updateRoom, getUserRooms } = useRooms();
    const oneRoom = roomsAndRoles?.find(item => item.roomId.toString() === idRoom) || null;
    const [title, setTitle] = useState(oneRoom?.room.name);
    const [description, setDescription] = useState(oneRoom?.room.description);
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        let hasError = false;
        if (title.trim().length < 2) {
            setTitleError('Title must be at least 2 characters long.');
            hasError = true;
        } else {
            setTitleError('');
        }

        if (description.trim().length < 5) {
            setDescriptionError('Description must be at least 5 characters long.');
            hasError = true;
        } else {
            setDescriptionError('');
        }
        if (!hasError) {
            event.preventDefault();
            const request: RoomUpdateDto = {
                roomId: oneRoom.roomId,
                name: title,
                description: description
            };
            await updateRoom(request);
            setOpen(false)
            window.location.reload(); // refresh to see updates
        }
    };

    return (
        <>

            <Dialog open={open}>
                <DialogContent className="gap-0 p-0 outline-none">
                    <DialogHeader className="px-4 pb-4 pt-5">
                        <DialogTitle className="">{t("Edit room")}</DialogTitle>
                        <DialogDescription>
                            {t("Your room is customizable, you can change your room title & description.")}
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="title" className="font-semibold">{t("Title")} :</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                />
                                {titleError && <span style={{ color: 'red' }}>{titleError}</span>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="font-semibold">{t("Description")} :</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className='flex h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                />
                                {descriptionError && (
                                    <span style={{ color: 'red' }}>{descriptionError}</span>
                                )}
                            </div>
                        </div>
                        <Separator />
                        <div className="p-3 pr-7 flex justify-end">
                            <Button type="submit" > {t("Submit")} </Button>
                        </div>
                    </form>

                </DialogContent>
            </Dialog>
        </>
    )
}