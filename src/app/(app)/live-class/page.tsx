
"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video as VideoIcon, Send, Users, Mic, MicOff, VideoOff, MessageCircle, PhoneOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface ChatMessage {
  sender: string;
  avatarFallback: string;
  text: string;
  isMe?: boolean;
}

interface Participant {
  name: string;
  avatarFallback: string;
  isTeacher?: boolean;
}

const mockParticipants: Participant[] = [
  { name: "Mrs. Davison", avatarFallback: "MD", isTeacher: true },
  { name: "You", avatarFallback: "Y" },
  { name: "Alice", avatarFallback: "A" },
  { name: "Bob", avatarFallback: "B" },
  { name: "Charlie", avatarFallback: "C" },
];

export default function LiveClassPage() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);


  const toggleCamera = () => setIsCameraOn(!isCameraOn);
  const toggleMic = () => setIsMicOn(!isMicOn);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;
    const newMessage: ChatMessage = {
      sender: "You",
      avatarFallback: "Y",
      text: chatInput,
      isMe: true,
    };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-[calc(100vh-8rem)]">
      {/* Main Content: Video and Controls */}
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col">
        <Card className="flex-1 flex flex-col glass-card relative overflow-hidden">
          <CardHeader className="absolute top-0 left-0 z-10 p-4 w-full bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                  <h1 className="text-xl font-bold text-white shadow-lg">Live Class: Algebra Basics</h1>
                  <p className="text-sm text-white/80">with Mrs. Davison</p>
              </div>
              <Badge variant="destructive" className="animate-pulse shadow-lg">
                <div className="h-2 w-2 rounded-full bg-white mr-2"></div>
                LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 bg-black flex items-center justify-center p-0">
              {isCameraOn ? (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-4">
                  <VideoOff size={64} className="text-white/30"/>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white/80">Your camera is off</p>
                    <p className="text-sm text-white/50">Click the camera icon to turn it on.</p>
                  </div>
                </div>
              )}
          </CardContent>
          <CardFooter className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-auto p-0">
             <TooltipProvider>
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md border border-white/20 p-2 rounded-full shadow-2xl">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={toggleMic} variant={isMicOn ? 'secondary': 'outline'} size="icon" className="rounded-full h-12 w-12 bg-transparent hover:bg-white/20 border-0 text-white hover:text-white">
                          {isMicOn ? <Mic /> : <MicOff />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isMicOn ? "Mute" : "Unmute"}</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={toggleCamera} variant={isCameraOn ? 'secondary': 'outline'} size="icon" className="rounded-full h-12 w-12 bg-transparent hover:bg-white/20 border-0 text-white hover:text-white">
                          {isCameraOn ? <VideoIcon /> : <VideoOff />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isCameraOn ? "Turn camera off" : "Turn camera on"}</TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="destructive" size="icon" className="rounded-full h-12 w-12">
                          <PhoneOff />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Leave Class</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </div>

      {/* Sidebar: Chat and Polls */}
      <div className="lg:col-span-1 xl:col-span-1 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col glass-card min-h-0">
            <TabsList className="grid w-full grid-cols-2 bg-card/80 m-2">
                <TabsTrigger value="chat"><MessageCircle className="w-4 h-4 mr-2"/>Chat</TabsTrigger>
                <TabsTrigger value="participants"><Users className="w-4 h-4 mr-2"/>Participants ({mockParticipants.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 min-h-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={cn("flex items-end gap-2", msg.isMe && "justify-end")}>
                      {!msg.isMe && <Avatar className="h-8 w-8"><AvatarFallback>{msg.avatarFallback}</AvatarFallback></Avatar>}
                      <div className={cn("max-w-[75%] rounded-xl px-3 py-2 text-sm", msg.isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none")}>
                        {!msg.isMe && <p className="font-semibold text-xs mb-0.5">{msg.sender}</p>}
                        <p>{msg.text}</p>
                      </div>
                      {msg.isMe && <Avatar className="h-8 w-8"><AvatarFallback>{msg.avatarFallback}</AvatarFallback></Avatar>}
                    </div>
                  ))}
                   {chatMessages.length === 0 && (
                     <div className="text-center text-muted-foreground pt-16">
                        <MessageCircle className="mx-auto h-10 w-10 mb-2"/>
                        <p className="text-sm">Chat messages will appear here.</p>
                     </div>
                   )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border/20">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4"/>
                  </Button>
                </form>
              </div>
            </TabsContent>
            <TabsContent value="participants" className="flex-1 p-0 m-0 min-h-0">
               <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {mockParticipants.map(p => (
                      <div key={p.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{p.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{p.name}</p>
                        </div>
                        {p.isTeacher && <Badge variant="secondary">Teacher</Badge>}
                      </div>
                    ))}
                  </div>
               </ScrollArea>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}
