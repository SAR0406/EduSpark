
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, ClipboardList, CalendarClock, BarChartBig, Megaphone, PlusCircle, BookOpen, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeacherDashboardPage() {
  const statsToDisplay = [
    { title: "Total Students", value: "0", icon: Users },
    { title: "Active Classes", value: "0", icon: CalendarClock },
    { title: "Assignments to Grade", value: "0", icon: ClipboardList },
    { title: "Avg. Class Performance", value: "N/A", icon: BarChartBig },
  ];

  const quickLinks = [
    { title: "Manage Students", href: "/teacher/manage-students", icon: Users },
    { title: "Create Assignment", href: "/teacher/assignments", icon: PlusCircle },
    { title: "Manage Resources", href: "/teacher/resources", icon: BookOpen },
    { title: "Post Announcement", href: "#", icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Your central hub to manage classes, students, and resources.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsToDisplay.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Quickly access common tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickLinks.map((link) => (
                     <Button key={link.href} variant="outline" asChild className="h-20 flex-col items-start p-4 gap-2 group">
                        <Link href={link.href}>
                            <link.icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                            <span className="text-base font-semibold">{link.title}</span>
                        </Link>
                    </Button>
                ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 border border-dashed rounded-lg">
                <Megaphone className="h-8 w-8 mb-2"/>
                <p className="text-sm">No recent announcements.</p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
