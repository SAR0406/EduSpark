
import { RecommendationEngine } from "@/components/recommendations/recommendation-engine";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <Lightbulb className="h-10 w-10 text-primary text-glow" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-gradient-primary">Content Recommendations</h1>
          <p className="text-md text-muted-foreground mt-1">
            Discover new learning materials tailored to your history and preferences.
          </p>
        </div>
      </div>
      <RecommendationEngine />
    </div>
  );
}
