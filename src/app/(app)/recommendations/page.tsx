
"use client";

import { RecommendationEngine } from "@/components/recommendations/recommendation-engine";
import { Lightbulb } from "lucide-react";

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Lightbulb className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-glow">Content Recommendations</h1>
          <p className="text-md text-muted-foreground mt-1">
            Discover new learning materials tailored to your history and preferences.
          </p>
        </div>
      </div>
      <RecommendationEngine />
    </div>
  );
}
