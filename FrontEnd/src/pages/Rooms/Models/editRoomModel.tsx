import { Button } from "@/components/ui/button";
import * as React from "react";
import { useRooms } from "@/Providers/RoomsContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface RoomUpdateDto {
    roomId: number;
    name: string;
    description: string;
}

export function EditRoomModel() {
    const { t } = useTranslation();
    const { idRoom } = useParams<{ idRoom: string }>(); // Ensure idRoom is of type string or adjust accordingly
    const { roomsAndRoles, updateRoom } = useRooms();
    const oneRoom = roomsAndRoles?.find(item => item.roomId.toString() === idRoom) ?? null;

    const initialTitle = oneRoom?.room.name ?? '';
    const initialDescription = oneRoom?.room.description ?? '';

    const [title, setTitle] = useState<string>(initialTitle);
    const [description, setDescription] = useState<string>(initialDescription);
    const [titleError, setTitleError] = useState<string>('');
    const [descriptionError, setDescriptionError] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!oneRoom) {
            console.error("Room not found");
            return;
        }

        let hasError = false;

        if (title.trim().length < 2) {
            setTitleError(t('Title must be at least 2 characters long.'));
            hasError = true;
        } else {
            setTitleError('');
        }

        if (description.trim().length < 5) {
            setDescriptionError(t('Description must be at least 5 characters long.'));
            hasError = true;
        } else {
            setDescriptionError('');
        }

        if (!hasError) {
            const request: RoomUpdateDto = {
                roomId: oneRoom.roomId,
                name: title,
                description: description
            };

            try {
                await updateRoom(request);
                console.log("Room updated successfully");
                // Optionally close the dialog or handle success state
            } catch (error) {
                console.error("Failed to update room:", error);
                // Handle error state
            }
        }
    };

    return (
        <>
            <Dialog open={true}>
                <DialogContent className="gap-0 p-0 outline-none">
                    <DialogHeader className="px-4 pb-4 pt-5">
                        <DialogTitle>{t("Edit room")}</DialogTitle>
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
                            <Button type="submit">{t("Submit")}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
