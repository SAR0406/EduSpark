
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FolderKanban, FileText, Video, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const placeholderResources: { id: string; title: string; type: string; subject: string; dateAdded: string; icon: React.ElementType; }[] = [];

export default function TeacherResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resource Hub</h1>
        <p className="text-muted-foreground">
          Manage and organize your teaching materials and notes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Your Resources</CardTitle>
              <CardDescription>Upload and manage your teaching materials.</CardDescription>
            </div>
             <Button>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload New Resource
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderResources.length > 0 ? placeholderResources.map(resource => (
              <Card key={resource.id} className="bg-secondary/50 hover:bg-accent transition-colors">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-background/50">
                      <resource.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.type}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Subject: {resource.subject}</p>
                  <p>Added: {resource.dateAdded}</p>
                </CardContent>
              </Card>
            )) : (
                <div className="col-span-full text-center text-muted-foreground py-20 flex flex-col items-center">
                    <FolderKanban className="h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold">Your resource library is empty</h3>
                    <p className="text-sm">Upload materials to share with your students.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
