import logoBlack from "@/assets/logoBlack.png";
import logoWhite from "@/assets/logoWhitee.png";
import { Nav } from "@/components/ui/nav";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import * as Icon from "lucide-react";
import * as React from "react";
//import { useTranslation } from "react-i18next";
//import { useNavigate } from 'react-router-dom';

interface sidebarProps {
  defaultLayout: number[];
  navCollapsedSize: number;
  titre: string;
}

interface Link {
  title: string;
  label?: string;
  icon: Icon.LucideIcon;
  href: string;
  variant: "default" | "ghost";
}



const links: Link[] = [
  {
    title: "Rooms",
    label: "128",
    icon: Icon.Home,
    variant: "ghost",
    href: "/rooms"
  },
  {
    title: "Direct Messages",
    label: "128",
    icon: Icon.MessageCircle,
    variant: "ghost",
    href: "/direct"
  },
  {
    title: "Profile",
    icon: Icon.User2Icon,
    variant: "ghost",
    href: "/profile"
  },
  {
    title: "Settings",
    label: "128",
    icon: Icon.Settings,
    variant: "ghost",
    href: "/settings/profile"
  },
  {
    title: "Test",
    label: "9",
    icon: Icon.Activity,
    variant: "ghost",
    href: "/test"
  },
  
];

function updateLinkVariant(title: string): void {
  links.forEach((link: Link) => {
    if (link.title === title) {
      link.variant = "default";
    } else {
      link.variant = "ghost";
    }
  });
}

export const Sidebar: React.FC<sidebarProps> = ({ defaultLayout, navCollapsedSize, titre }) => {

  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const titleToSetDefault = titre;

  updateLinkVariant(titleToSetDefault);

  const theme = localStorage.getItem('vite-ui-theme');
  // Define an array of light themes
  const lightThemes = [
    'slateLight',
    'blueLight',
    'orangeLight',
    'yellowLight',
    'redLight',
    'greenLight',
    'violetLight',
  ];

  // Check if the theme exists and is a light theme
  const isLightTheme = theme && lightThemes.includes(theme);

  return (
    <>
      {/* SideBar*/}
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={15}
        maxSize={15}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
        className="min-w-[50px] transition-all duration-300 ease-in-out bg-accent "
      >
        {isLightTheme ? (
          <img src={logoBlack} alt="Logo" className="" />
        ) : (
          <img src={logoWhite} alt="Logo" className="" />
        )}
        <div className="flex flex-col justify-between h-screen ">
          <div className="flex flex-col h-fit ">
            <Nav isCollapsed={isCollapsed} links={links} />
          </div>
        </div>
       
      </ResizablePanel>
      <ResizableHandle withHandle />
    </>
  );
}
