
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handleAskQuestion } from "@/lib/actions";
import { Loader2, User, Bot, Send, Paperclip, XCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import NextImage from "next/image";
import { awardAchievement } from "@/lib/achievements";

const chatSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
  learningMaterial: z.string().min(1, "Context cannot be empty."),
  imageDataUri: z.string().optional(),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  imageDataUri?: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [aiCompanionQuestions, setAiCompanionQuestions] = useState(0);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      question: "",
      learningMaterial: "",
      imageDataUri: "",
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ variant: "destructive", title: "Image Too Large", description: "Please select an image smaller than 4MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreviewUrl(result);
        form.setValue("imageDataUri", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreviewUrl(null);
    form.setValue("imageDataUri", undefined);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };


  async function onSubmit(values: ChatFormValues) {
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: values.question,
      imageDataUri: values.imageDataUri,
    };
    setMessages((prev) => [...prev, userMessage]);
    
    form.resetField("question");
    clearImage();

    const result = await handleAskQuestion({
      question: values.question,
      learningMaterial: values.learningMaterial,
      imageDataUri: values.imageDataUri,
    });

    if (result.success && result.data) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: result.data.answer,
      };
      setMessages((prev) => [...prev, aiMessage]);
      const newCount = aiCompanionQuestions + 1;
      setAiCompanionQuestions(newCount);
      if (newCount >= 1) awardAchievement('aiCompanion', toast);
    } else {
      toast({
        variant: "destructive",
        title: "AI Tutor Error",
        description: result.error || "Failed to get an answer.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-full glass-card">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow h-full">
        <div className="p-4 border-b border-white/10">
           <FormField
              control={form.control}
              name="learningMaterial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">Context (Your Learning Material)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste relevant text from your study material here for the AI to reference..."
                      className="min-h-[80px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
       
        <div className="flex-grow flex flex-col overflow-hidden">
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
              <div className="space-y-6">
                  {messages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                      {message.sender === 'ai' && <Avatar className="h-8 w-8 border border-primary/50"><AvatarFallback className="bg-transparent"><Bot className="text-primary"/></AvatarFallback></Avatar>}
                      <div className={`max-w-[80%] rounded-xl p-3 shadow-md ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          {message.imageDataUri && <NextImage src={message.imageDataUri} alt="User attachment" width={200} height={150} className="rounded-md mb-2" />}
                          <p className="whitespace-pre-wrap text-base leading-relaxed">{message.text}</p>
                      </div>
                      {message.sender === 'user' && <Avatar className="h-8 w-8"><AvatarFallback><User /></AvatarFallback></Avatar>}
                  </div>
                  ))}
                  {isLoading && (
                      <div className="flex items-center justify-start gap-3">
                          <Avatar className="h-8 w-8 border border-primary/50"><AvatarFallback className="bg-transparent"><Bot className="text-primary"/></AvatarFallback></Avatar>
                          <div className="bg-muted p-3 rounded-lg"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
                      </div>
                  )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-white/10 bg-card/50">
              {imagePreviewUrl && (
                <div className="relative w-fit mb-2">
                  <NextImage src={imagePreviewUrl} alt="Preview" width={80} height={80} className="rounded-md border border-white/10" />
                  <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={clearImage}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Type your question here... (Shift+Enter for new line)"
                          className="pr-24 min-h-[52px]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                          {...field}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                                <Paperclip className="h-5 w-5" />
                                <span className="sr-only">Attach image</span>
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                          <Button type="submit" size="icon" disabled={isLoading}>
                            <Send className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
        </div>
      </form>
    </Form>
    </div>
  );
}
