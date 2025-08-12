
import { StudyPlanGenerator } from "@/components/study-plan/study-plan-generator";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function StudyPlanPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <ClipboardList className="h-10 w-10 text-primary text-glow" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-gradient-primary">Personalized Study Plan Generator</h1>
          <p className="text-md text-muted-foreground mt-1">
            Let our AI craft a study plan tailored to your performance, goals, and available materials.
          </p>
        </div>
      </div>
      <StudyPlanGenerator />
    </div>
  );
}
