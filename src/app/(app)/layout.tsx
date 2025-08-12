
"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { AppLayoutClient } from "@/components/layout/app-layout-client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
            router.push("/login");
            return (
                <div className="flex h-screen items-center justify-center bg-background">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            );
        }
        return <>{children}</>;
    }
    
    return (
       <AppLayoutClient>
          {children}
       </AppLayoutClient>
    );
}
