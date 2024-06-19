import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LoginForm } from "@/pages/Authentification/loginForm"
import { Metadata } from "next"
import Link from "next/link"
import ParticleRing from './ParticleRing'
import { useTranslation } from "react-i18next"
/*88*/
export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function Login() {
  const { t } = useTranslation();
  return (
    <>
      <div className="md:hidden">
      
      </div>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          {t("Sign up")}
        </Link>
        
        <ParticleRing /> 
        
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-6xl mb-10 font-extrabold tracking-tight antialiased text-violet-800">
              {t("Login")}
              </h1>
            </div>
            <LoginForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              {t("By clicking continue, you agree to our")}{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("Terms of Service")}
              </Link>{" "}
              {t("and")}{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("Privacy Policy")}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
