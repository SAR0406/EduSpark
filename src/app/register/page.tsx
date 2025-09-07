
"use client";

import * as React from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { EduSparkLogo } from "@/components/icons/logo";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-gradient-to-b from-background via-background/90 to-background/80">
       <div className="flex items-center justify-center py-12 px-4">
        <div className="mx-auto grid w-[380px] gap-6 glass-card glass-hover rounded-2xl p-6">
          <div className="grid gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-4">
                <EduSparkLogo className="h-7 w-auto text-glow" />
            </Link>
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Join EduSpark and start your personalized learning journey today.
            </p>
          </div>
          {isClient ? <RegisterForm /> : <div className="h-[340px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-semibold text-primary">
              Log in
            </Link>
          </div>
        </div>
      </div>
       <div className="hidden lg:block relative">
         <Image
          src="https://i.ibb.co/xKCHSHD2/20250521-0854-Edu-Spark-Educational-Banner-simple-compose-01jvrdts8qefg8yjqxfhkarkd5.png"
          alt="EduSpark innovative learning banner"
          layout="fill"
          className="h-full w-full object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent"></div>
      </div>
    </div>
  );
}
