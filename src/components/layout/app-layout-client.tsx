
"use client";

import Link from "next/link";
import * as React from "react";
import {
  Bell,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  MessageCircleQuestion,
  Settings,
  BarChart3,
  Trophy,
  Calculator,
  Code2,
  AlignLeft,
  Brain,
  Search,
  FileSignature,
  Layers,
  Feather,
  Share2,
  FileText,
  VenetianMask,
  Users as UsersIcon,
  Video,
  BookCopy,
} from "lucide-react";
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarTrigger,
    useSidebar,
    SidebarInset,
    SidebarGroupLabel
} from "@/components/ui/sidebar";
import { EduSparkLogo } from "@/components/icons/logo";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | null;

const navItems = {
  student: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/chatbot", icon: MessageCircleQuestion, label: "AI Tutor" },
    { href: "/quizzes", icon: VenetianMask, label: "AI Quiz Generator" },
    { href: "/content", icon: BookCopy, label: "Chapter Materials" },
    { href: "/progress", icon: BarChart3, label: "My Progress" },
    { href: "/achievements", icon: Trophy, label: "Achievements" },
    { href: "/live-class", icon: Video, label: "Live Class" },
  ],
  teacher: [
    { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/teacher/assignments", icon: FileSignature, label: "Assignments" },
    { href: "/teacher/manage-students", icon: UsersIcon, label: "Manage Students" },
    { href: "/teacher/resources", icon: BookOpen, label: "Resources" },
    { href: "/quizzes", icon: VenetianMask, label: "Quiz Generator" },
  ],
  parent: [
    { href: "/parent/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/parent/child-progress", icon: BarChart3, label: "Child's Progress" },
    { href: "/parent/communication", icon: MessageCircleQuestion, label: "Communication" },
  ],
  admin: [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/user-management", icon: UsersIcon, label: "User Management" },
    { href: "/admin/content-management", icon: BookOpen, label: "Content Management" },
  ],
  default: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ],
};

const aiTools = [
    { href: "/homework-helper", icon: Calculator, label: "Homework Helper" },
    { href: "/code-generator", icon: Code2, label: "Code Generator" },
    { href: "/summarizer", icon: AlignLeft, label: "Text Summarizer" },
    { href: "/essay-generator", icon: FileSignature, label: "Essay Generator" },
    { href: "/flashcard-generator", icon: Layers, label: "Flashcard Maker" },
    { href: "/interactive-story", icon: Feather, label: "AI Story Weaver" },
    { href: "/concept-visualizer", icon: Share2, label: "Concept Illustrator" },
    { href: "/question-paper-generator", icon: FileText, label: "Exam Paper Generator" },
    { href: "/debate-topic-suggester", icon: Brain, label: "Debate Suggester" },
    { href: "/recommendations", icon: Lightbulb, label: "AI Recommendations" },
    { href: "/study-plan", icon: ClipboardList, label: "Study Plan Generator" },
    { href: "/youtube-tutorials", icon: BookOpen, label: "YouTube Tutorials" },
];

function InnerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = React.useState<FirebaseUser | null>(null);
    const [userRole, setUserRole] = React.useState<UserRole>(null);
    const [isCommandOpen, setIsCommandOpen] = React.useState(false);
    
    const { isMobile, setOpenMobile } = useSidebar();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsCommandOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setIsCommandOpen(false);
        command();
    };

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserRole(userDocSnap.data().role as UserRole || 'student');
                } else {
                    setUserRole('student');
                }
            } else {
                setCurrentUser(null);
                setUserRole(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            toast({ title: "Logout Successful" });
            router.push("/login");
        } catch (error) {
            toast({ title: "Logout Failed", variant: "destructive" });
        }
    };
    
    const currentNavItems = navItems[userRole || 'student'] || navItems.default;
    const allNavItems = [...currentNavItems, ...aiTools];

    return (
      <div className="relative flex h-screen w-full">
        <Sidebar>
            <SidebarHeader>
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <EduSparkLogo className="h-6 w-auto text-glow shrink-0" />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    </SidebarMenuItem>
                    {currentNavItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href} onClick={isMobile ? () => setOpenMobile(false) : undefined}>
                                <SidebarMenuButton
                                    isActive={pathname.startsWith(item.href)}
                                    tooltip={item.label}
                                >
                                    <item.icon />
                                    {item.label}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                         <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
                    </SidebarMenuItem>
                    {aiTools.map((item) => (
                         <SidebarMenuItem key={item.label}>
                            <Link href={item.href} onClick={isMobile ? () => setOpenMobile(false) : undefined}>
                                <SidebarMenuButton
                                    isActive={pathname.startsWith(item.href)}
                                    tooltip={item.label}
                                >
                                    <item.icon />
                                    {item.label}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start items-center p-2.5 h-auto">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={currentUser?.photoURL || ''} alt={currentUser?.displayName || 'User'}/>
                                <AvatarFallback>{currentUser?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                             <div className="ml-2 text-left w-[calc(100%-3rem)] truncate">
                                <p className="text-sm font-semibold leading-tight truncate">{currentUser?.displayName || "User"}</p>
                                <p className="text-xs text-muted-foreground leading-tight truncate">{currentUser?.email}</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                        <DropdownMenuItem asChild><Link href="/settings"><Settings className="mr-2 h-4 w-4"/>Settings</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col h-full">
             <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6 sticky top-0 z-30">
                <SidebarTrigger/>
                <div className="w-full flex-1">
                    <Button
                        variant="outline"
                        className="w-full max-w-sm justify-start text-left text-muted-foreground gap-2 hidden sm:flex"
                        onClick={() => setIsCommandOpen(true)}
                    >
                        <Search className="h-4 w-4" />
                        Search tools & pages...
                        <CommandShortcut>⌘K</CommandShortcut>
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full sm:hidden" onClick={() => setIsCommandOpen(true)}>
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </header>
             <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
             <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                    {allNavItems.map((item) => (
                    <CommandItem key={item.href} onSelect={() => runCommand(() => { router.push(item.href); if (isMobile) setOpenMobile(false); })}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                    </CommandItem>
                    ))}
                </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
      </div>
    );
}

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <InnerLayout>{children}</InnerLayout>
        </SidebarProvider>
    )
}
