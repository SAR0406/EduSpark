
import { ChatInterface } from "@/components/chatbot/chat-interface";
import { Bot } from "lucide-react";

export default function ChatbotPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
       <div className="flex items-center gap-4 p-2 mb-4">
          <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-glow">AI Tutor</h1>
            <p className="text-md text-muted-foreground mt-1">
              Your personal AI learning assistant. Ask questions and provide context.
            </p>
          </div>
        </div>
      <div className="flex-grow min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
