
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ClipboardList, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const placeholderAssignments: { id: string; title: string; subject: string; class: string; dueDate: string; status: string; submissions: string; }[] = [];

export default function CreateAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assignment Management</h1>
        <p className="text-muted-foreground">
          Create, distribute, and track assignments for your students.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Your Assignments</CardTitle>
              <CardDescription>View all assignments you've created.</CardDescription>
            </div>
              <Button>
                  <PlusCircle className="mr-2 h-4 w-4"/> Create New Assignment
              </Button>
            </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
            {placeholderAssignments.length > 0 ? placeholderAssignments.map(assignment => (
              <Card key={assignment.id} className="bg-secondary/50 hover:bg-accent transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>{assignment.subject} - {assignment.class}</CardDescription>
                    </div>
                    <Badge variant={assignment.status === "Published" ? "default" : "secondary"}>
                      {assignment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <p>Due: {assignment.dueDate}</p>
                    <p>Submissions: {assignment.submissions}</p>
                </CardFooter>
              </Card>
            )) : (
                <div className="text-center text-muted-foreground py-20 flex flex-col items-center">
                    <ClipboardList className="h-12 w-12 mb-4"/>
                    <h3 className="text-lg font-semibold">No assignments found</h3>
                    <p className="text-sm">Create one to get started.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
