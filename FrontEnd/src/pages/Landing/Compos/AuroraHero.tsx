import Logo from "@/assets/LogoWhite.png";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
//import { GlobeDemo } from "./GlobeDemo";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//import { LanguageChanger } from "@/components/shared/LanguageChanger";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export default function AuroraHero({ }) {
  const { t } = useTranslation();
  const color = useMotionValue(COLORS_TOP[0]);
  const navigate = useNavigate();
  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;


  return (
    
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      {/* START Navigation */}
      <nav className="absolute w-full z-20 top-2 start-0 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={Logo} className="h-8" alt="Flowbite Logo" />

          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <motion.button
              style={{
                border,
              }}
              whileHover={{
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.985,
              }}
              onClick={() =>  navigate('/login')}
              className="group relative flex w-fit items-center gap-1.5 rounded-2xl bg-gray-950/10 px-4 py-1.5 text-gray-50 transition-colors hover:bg-gray-950/50"
            >
              {t("Log in")}
              <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
            </motion.button>
          </div>

        </div>
      </nav>
      {/* END Navigation */}
      <div className="relative z-10 flex flex-col items-center">

        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          <strong>Pro</strong>-{t("level collaboration")} </h1>          
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed mb-20">
          {t("Unlock seamless")}  
                </p>
        <motion.button
          style={{
            border,
            boxShadow,
          }}
          whileHover={{
            scale: 1.015,
          }}
          whileTap={{
            scale: 0.985,
          }}
          onClick={() =>  navigate('/signup')}
          className="group relative font-bold flex w-fit text-2xl items-center gap-1.5 rounded-full bg-gray-950/10 px-7 py-3 text-gray-50 transition-colors hover:bg-gray-950/50"
        >
          {t("Join room")}
          <FiArrowRight className="transition-transform font-extrabold group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={3500} factor={4} fade speed={2} />
        </Canvas>
      </div>

    </motion.section>
  );
};