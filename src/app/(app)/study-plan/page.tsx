
"use client";

import { StudyPlanGenerator } from "@/components/study-plan/study-plan-generator";
import { ClipboardList } from "lucide-react";

export default function StudyPlanPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <ClipboardList className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-glow">Personalized Study Plan Generator</h1>
          <p className="text-md text-muted-foreground mt-1">
            Let our AI craft a study plan tailored to your performance, goals, and available materials.
          </p>
        </div>
      </div>
      <StudyPlanGenerator />
    </div>
  );
}
