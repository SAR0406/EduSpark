
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const placeholderStudents: { id: string; name: string; email: string; grade: string; status: string; avatarFallback: string; avatarUrl: string; }[] = [];

export default function ManageStudentsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold">Student Management</h1>
        <p className="text-muted-foreground">
          Oversee student profiles, monitor progress, and manage enrollments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Student Roster</CardTitle>
              <CardDescription>View and manage all enrolled students.</CardDescription>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="relative flex-1 sm:flex-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-8" />
                </div>
                 <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Add Student
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placeholderStudents.length > 0 ? placeholderStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/50">
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={student.avatarUrl} alt={student.name} />
                                <AvatarFallback>{student.avatarFallback}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{student.grade}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon"><span className="sr-only">Menu</span>...</Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No students found. Add students to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
