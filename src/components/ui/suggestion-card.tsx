
"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface SuggestionCardProps {
  icon?: LucideIcon;
  title?: string;
  message: string;
  className?: string;
}

export function SuggestionCard({
  icon: Icon = Lightbulb,
  title = "Suggestion",
  message,
  className,
}: SuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "glass-card p-4 flex items-start gap-4 rounded-xl border-dashed border-primary/30 bg-primary/5",
        className
      )}
    >
      <div className="p-2 rounded-full bg-primary/10 text-primary mt-1">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  );
}
