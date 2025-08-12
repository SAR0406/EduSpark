
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const childName = "Alex";

const overallProgressData = {
  score: 0,
  completedModules: 0,
  totalModules: 0,
  timeSpent: "0h 0m",
};

const subjectProgressData = [
  { name: "Mathematics", score: 0, progress: 0 },
  { name: "Science", score: 0, progress: 0 },
  { name: "History", score: 0, progress: 0 },
];

const recentAchievements: { title: string; date: string; subject: string; }[] = [];

export default function ChildProgressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{childName}'s Academic Progress</h1>
        <p className="text-muted-foreground">
          An overview of performance, subject mastery, and achievements.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <h3 className="text-sm font-medium text-secondary-foreground/80">Average Score</h3>
            <p className="text-2xl font-bold text-secondary-foreground">{overallProgressData.score > 0 ? `${overallProgressData.score}%` : 'N/A'}</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <h3 className="text-sm font-medium text-secondary-foreground/80">Modules Completed</h3>
            <p className="text-2xl font-bold text-secondary-foreground">{overallProgressData.completedModules} / {overallProgressData.totalModules > 0 ? overallProgressData.totalModules : 'N/A'}</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <h3 className="text-sm font-medium text-secondary-foreground/80">Total Study Time</h3>
            <p className="text-2xl font-bold text-secondary-foreground">{overallProgressData.timeSpent}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectProgressData.length > 0 ? subjectProgressData.map((subject) => (
              <div key={subject.name}>
                <div className="flex justify-between mb-1 text-sm">
                  <h4 className="font-medium">{subject.name}</h4>
                  <span className="text-muted-foreground">{subject.score > 0 ? `${subject.score}%` : 'N/A'}</span>
                </div>
                <Progress value={subject.progress} />
              </div>
            )) : (
              <p className="text-muted-foreground text-center py-6">Subject data will appear here.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
              {recentAchievements.length > 0 ? (
                  <ul className="space-y-4">
                      {recentAchievements.map((ach, index) => (
                          <li key={index} className="flex items-center gap-4">
                              <div className="p-2 bg-secondary rounded-md">
                                <Award className="h-5 w-5" />
                              </div>
                              <div>
                                  <h4 className="font-semibold text-sm">{ach.title}</h4>
                                  <p className="text-xs text-muted-foreground">{ach.subject} - {ach.date}</p>
                              </div>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground p-8 border border-dashed rounded-lg">
                    <p className="text-sm">No recent achievements.</p>
                  </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
