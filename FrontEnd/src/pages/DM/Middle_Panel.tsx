import { useAuth } from '@/Providers/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ComponentProps, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent
} from "../../components/ui/tabs";
import { NewChat } from "./Models/NewChat";
import { useTranslation } from 'react-i18next';

export function Middle_Panel({ }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { users } = useAuth();
  const [selected, setSelected] = useState<number>();


  return (
    <>
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Title Panel 2 */}
          <h1 className="text-xl font-bold">Direct messages</h1>
          <div className="flex items-center gap-3">
            <NewChat />
          </div>
        </div>
        <Separator />
        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={`${t("Search")}...`} className="pl-8" />
            </div>
          </form>
        </div>

        {/* Panel 2 Content */}

        <TabsContent value="all" className="m-0">
          <ScrollArea className="h-screen">
            <div className="flex flex-col  pt-0">
              {users?.map((contact) => (
                <button
                  key={contact.id}
                  className={cn(
                    "flex flex-col items-start gap-3 border-t-2 p-3 text-left text-sm transition-all hover:bg-accent ",
                    selected === contact.id && "bg-accent"
                  )}
                  onClick={() => {
                    setSelected(contact.id);
                    navigate(`/direct/${contact.id}`);
                  }}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <Avatar>
                      <AvatarImage src={`${contact.avatarUrl}`} alt="@shadcn" />
                      <AvatarFallback className="bg-primary-foreground text-secondary-foreground  font-bold" >
                        {(contact.firstName[0] + contact.lastName[0])}
                        
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full ">
                      <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2">
                            {/* Contact name */}
                            <div className="font-bold text-lg" >{contact.firstName + " " + contact.lastName}</div>

                          </div>
                          <div
                            className={cn(
                              "ml-auto text-xs",
                              selected === contact.id
                                ? " font-extrabold"
                                : "text-muted-foreground"
                            )}
                          >
                            
                          </div>
                        </div>

                      </div>
                      <div className="line-clamp-2 text-xs text-muted-foreground">
                        {/* Under Contact name  */}
                        {contact.email}
                      </div>
                    </div>
                  </div>

                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs >

    </>
  )
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}
