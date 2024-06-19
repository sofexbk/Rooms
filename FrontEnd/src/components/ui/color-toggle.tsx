import { Moon, Sun } from "lucide-react"
type Theme = "slateLight" | "blueLight" | "orangeLight" | "yellowLight" | "redLight"| "greenLight" | "violetLight" | "slateDark"| "blueDark" | "orangeDark"| "violetDark" | "yellowDark"| "redDark" | "greenDark"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/ui/color-provider"

export function ColorToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
  <DropdownMenuLabel>Light mode</DropdownMenuLabel>
  <DropdownMenuSeparator />
  
  <DropdownMenuItem onClick={() => setTheme("violetLight")}>
    <div className="w-4 h-4 mr-3 bg-violet-500 rounded-full"></div>
    <div className="capitalize">violet</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("blueLight")}>
    <div className="w-4 h-4 mr-3 bg-blue-500 rounded-full"></div>
    <div className="capitalize">blue</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("greenLight")}>
    <div className="w-4 h-4 mr-3 bg-green-500 rounded-full"></div>
    <div className="capitalize">green</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("yellowLight")}>
    <div className="w-4 h-4 mr-3 bg-yellow-500 rounded-full"></div>
    <div className="capitalize">yellow</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("orangeLight")}>
    <div className="w-4 h-4 mr-3 bg-orange-500 rounded-full"></div>
    <div className="capitalize">orange</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("redLight")}>
    <div className="w-4 h-4 mr-3 bg-red-500 rounded-full"></div>
    <div className="capitalize">red</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("slateLight")}>
    <div className="w-4 h-4 mr-3 bg-slate-500 rounded-full"></div>
    <div className="capitalize">slate</div>
  </DropdownMenuItem>

  <DropdownMenuSeparator />
  <DropdownMenuLabel>Dark mode</DropdownMenuLabel>
  <DropdownMenuSeparator />
  
  <DropdownMenuItem onClick={() => setTheme("violetDark")}>
    <div className="w-4 h-4 mr-3 bg-violet-600 rounded-full"></div>
    <div className="capitalize">violet</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("blueDark")}>
    <div className="w-4 h-4 mr-3 bg-blue-600 rounded-full"></div>
    <div className="capitalize">blue</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("greenDark")}>
    <div className="w-4 h-4 mr-3 bg-green-600 rounded-full"></div>
    <div className="capitalize">green</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("yellowDark")}>
    <div className="w-4 h-4 mr-3 bg-yellow-600 rounded-full"></div>
    <div className="capitalize">yellow</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("orangeDark")}>
    <div className="w-4 h-4 mr-3 bg-orange-600 rounded-full"></div>
    <div className="capitalize">orange</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("redDark")}>
    <div className="w-4 h-4 mr-3 bg-red-600 rounded-full"></div>
    <div className="capitalize">red</div>
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setTheme("slateDark")}>
    <div className="w-4 h-4 mr-3 bg-slate-600 rounded-full"></div>
    <div className="capitalize">slate</div>
  </DropdownMenuItem>
</DropdownMenuContent>


    </DropdownMenu>
  )
}
