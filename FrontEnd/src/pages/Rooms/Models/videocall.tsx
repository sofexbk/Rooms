import * as React from "react";
import { Check, Plus, Send, Video } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

const users = [
    {
        name: "Olivia Martin",
        email: "m@example.com",
        avatar: "/avatars/01.png",
    },
    {
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        avatar: "/avatars/03.png",
    },
    {
        name: "Emma Wilson",
        email: "emma@example.com",
        avatar: "/avatars/05.png",
    },
    {
        name: "Jackson Lee",
        email: "lee@example.com",
        avatar: "/avatars/02.png",
    },
    {
        name: "William Kim",
        email: "will@email.com",
        avatar: "/avatars/04.png",
    },
];

type User = typeof users[number];

export function VideoCall() {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);
    const [input, setInput] = React.useState("");
    const inputLength = input.trim().length;

    const handleRoomMeetClick = () => {
        window.location.href = "http://localhost:8082/video-call?username=Room";
        // Replace with your actual URL
    };

    return (
        <>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="ml-auto rounded-lg"
                            onClick={() => setOpen(true)}
                        >
                            <Video className="h-4 w-4" />
                            <span className="sr-only">{t("Video call")}</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={10}>{t("Video call")}</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="gap-0 p-0 outline-none h-5/6 w-screen">
                    <DialogHeader className="px-4 pb-4 pt-5">
                        <DialogTitle>{t("Video call")}</DialogTitle>
                        <DialogDescription>
                            <a
                                href="http://localhost:8082/video-call?username=Room"
                                onClick={handleRoomMeetClick}
                                target="_blank" // Opens in a new tab/window
                                rel="noopener noreferrer"
                            >
                                {t("Create a Room meet")}
                            </a>
                        </DialogDescription>
                    </DialogHeader>
                    
                    {/* Add additional DialogContent or components as needed */}
                    
                </DialogContent>
            </Dialog>
        </>
    );
}
