
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, CheckCircle, Unlock } from "lucide-react";
import { allPossibleAchievementsList } from "@/lib/achievements";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string; // Not used in this design, but kept for type consistency
  bgColor: string; // Not used in this design, but kept for type consistency
  progress?: number;
  points?: number;
  achieved?: boolean;
}

export default function AchievementsPage() {
  const [displayedAchievements, setDisplayedAchievements] = React.useState<Achievement[]>([]);
  const [achievedCount, setAchievedCount] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const updatedAchievements = allPossibleAchievementsList.map(achDef => {
        const isAchieved = localStorage.getItem(`eduspark_achievement_${achDef.id}`) === "true";
        return { 
          ...achDef, 
          achieved: isAchieved, 
          progress: isAchieved ? 100 : (achDef.progress || 0) 
        };
      });

      setDisplayedAchievements(updatedAchievements);
      setAchievedCount(updatedAchievements.filter(a => a.achieved).length);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          You've earned {achievedCount} of {allPossibleAchievementsList.length} achievements. Keep up the great work!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedAchievements.map((achievement) => (
          <Card key={achievement.id} className={cn("transition-all", achievement.achieved ? 'border-primary/50' : '')}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-lg", achievement.achieved ? 'bg-primary/10' : 'bg-secondary')}>
                  <achievement.icon className={cn("h-6 w-6", achievement.achieved ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    {achievement.achieved ? (
                      <><CheckCircle className="h-4 w-4 text-green-500" /> Achieved!</>
                    ) : (
                      <><Unlock className="h-4 w-4" /> Locked</>
                    )}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 min-h-[40px]">{achievement.description}</p>
              <Progress value={achievement.progress} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
