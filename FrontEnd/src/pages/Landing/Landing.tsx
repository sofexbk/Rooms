"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import AuroraHero from "./Compos/AuroraHero"
import ShuffleHero from "./Compos/ShuffleHero"
import { GlobeDemo } from "./Compos/GlobeDemo"
//import { LanguageChanger } from "@/components/shared/LanguageChanger"


interface LandingProps {

}

export default function Landing({ }: LandingProps) {

  return (
    <> 
    <ScrollArea className="h-screen scroll-smooth">
      <AuroraHero />
      <GlobeDemo />
      <ShuffleHero />
    </ScrollArea>    

    </>
  )
}
