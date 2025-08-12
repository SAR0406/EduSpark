
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, Users, BookOpen, BarChartHorizontalBig, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {

  const adminStats = [
    { title: "Total Users", value: "0", icon: Users },
    { title: "Teachers", value: "0", icon: Users },
    { title: "Published Content", value: "0", icon: BookOpen },
    { title: "Platform Engagement", value: "0%", icon: BarChartHorizontalBig },
  ];

  const quickLinks = [
    { title: "User Management", href: "/admin/user-management" },
    { title: "Content Management", href: "/admin/content-management" },
    { title: "Platform Analytics", href: "#" },
    { title: "System Configuration", href: "#" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Oversee platform operations, manage users & content, and view analytics.
        </p>
      </div>

       <section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminStats.map((stat) => (
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
      </section>

      <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
             <CardDescription>Jump to key administrative functions.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Button key={link.title} asChild variant="outline" className="h-16 justify-between group text-base">
                <Link href={link.href}>
                  <span>{link.title}</span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"/>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
    </div>
  );
}
