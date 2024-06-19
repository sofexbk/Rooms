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
import { useTranslation } from "react-i18next"

interface RoomCreateDto {
    adminId: number;
    name: string;
    description: string;
}


export function AddRoomModel() {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false)
    const { user } = useAuth();
    const { addRoom, getUserRooms } = useRooms();


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
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
            const request: RoomCreateDto = {
                adminId: user?.id,
                name: title,
                description: description
            }
            addRoom(request)
            setOpen(false)
            setDescription('')
            setTitle('')
        }
    };



    return (
        <>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="ml-auto rounded-xl"
                            onClick={() => setOpen(true)}
                        >
                            <PlusCircle className="h-5 w-5" />
                            <span className="sr-only">{t("Add room")}</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={10}>{t("Add room")}</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="gap-0 p-0 outline-none">
                    <DialogHeader className="px-4 pb-4 pt-5">
                        <DialogTitle className="">{t("Add room")}</DialogTitle>
                        <DialogDescription>
                            {t("Add your own room, Invite member to this room, and communicate together.")}
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