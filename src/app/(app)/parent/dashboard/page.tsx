
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, MessageSquare, UserCircle, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const childData = {
  name: "Alex",
  grade: "8th Grade",
  avatarUrl: "",
};

export default function ParentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <p className="text-muted-foreground">
          Stay connected with {childData.name}'s ({childData.grade}) academic journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="text-primary"/>Child's Progress</CardTitle>
                <CardDescription>View a detailed breakdown of your child's performance and activity.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/parent/child-progress">View Progress Report <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare className="text-primary"/>Communication</CardTitle>
                <CardDescription>Connect with teachers and school administration.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/parent/communication">Go to Inbox <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCircle className="text-primary"/>Account Settings</CardTitle>
                <CardDescription>Manage your profile and notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/settings">Go to Settings <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
