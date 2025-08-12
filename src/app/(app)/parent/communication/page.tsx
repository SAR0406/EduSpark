
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const placeholderMessages: { id: number; sender: string; subject: string; snippet: string; date: string; unread: boolean; avatarFallback: string; }[] = [];

export default function ParentCommunicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Communication Center</h1>
        <p className="text-muted-foreground">
          View messages from teachers and stay informed.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
            <div className="flex justify-between items-center">
                <CardTitle>Inbox</CardTitle>
                <Button>
                    <Send className="mr-2 h-4 w-4" /> Compose Message
                </Button>
            </div>
        </CardHeader>
        <CardContent className="pt-6">
          {placeholderMessages.length > 0 ? (
            <div className="space-y-4">
              {placeholderMessages.map((msg) => (
                <div key={msg.id} className={`p-4 rounded-lg border ${msg.unread ? "bg-accent" : "bg-secondary/50"}`}>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback>{msg.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${msg.unread ? "text-accent-foreground" : ""}`}>{msg.sender}</h4>
                        <span className="text-xs text-muted-foreground">{msg.date}</span>
                      </div>
                      <p className="text-sm font-medium">{msg.subject}</p>
                      <p className="text-sm text-muted-foreground truncate">{msg.snippet}</p>
                    </div>
                    {msg.unread && <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1"></div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-20 flex flex-col items-center">
              <Inbox className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Your inbox is empty</h3>
              <p className="text-sm">Messages from teachers will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
