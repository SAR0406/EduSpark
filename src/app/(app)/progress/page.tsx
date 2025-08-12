
"use client"; 
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Trophy, Award, TrendingUp, Target, Loader2, PlusCircle, Activity } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { allPossibleAchievementsList } from "@/lib/achievements";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, Timestamp, type DocumentData } from "firebase/firestore";
import { logStudyActivity } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StudyActivity {
  id: string;
  title: string;
  subject: string;
  timestamp: Date;
  type: string;
}

export default function ProgressPage() {
  const [achievementsUnlocked, setAchievementsUnlocked] = React.useState(0);
  const [recentActivities, setRecentActivities] = React.useState<(StudyActivity | any)[]>([]);
  const [totalXP, setTotalXP] = React.useState(0);
  const [currentUser, setCurrentUser] = React.useState<FirebaseUser | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = React.useState(true);
  const [newActivityTitle, setNewActivityTitle] = React.useState("");
  const [newActivitySubject, setNewActivitySubject] = React.useState("");
  const [isLoggingActivity, setIsLoggingActivity] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setIsLoadingActivities(true);
        const activitiesColRef = collection(db, 'users', user.uid, 'studyActivities');
        const q = query(activitiesColRef, orderBy("timestamp", "desc"));
        
        const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
          const fetchedActivities: StudyActivity[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            fetchedActivities.push({
              id: doc.id,
              title: data.title,
              subject: data.subject,
              timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
              type: "Study Session"
            });
          });
          setRecentActivities(fetchedActivities.slice(0, 10));
          setIsLoadingActivities(false);
        }, (error) => {
          console.error("Error fetching activities:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not fetch activities." });
          setIsLoadingActivities(false);
        });
        return () => unsubscribeFirestore();
      } else {
        setIsLoadingActivities(false);
        setRecentActivities([]);
      }
    });

    if (typeof window !== 'undefined') {
        let unlockedCount = 0;
        allPossibleAchievementsList.forEach(achDef => {
            if (localStorage.getItem(`eduspark_achievement_${achDef.id}`) === "true") {
                unlockedCount++;
            }
        });
        setAchievementsUnlocked(unlockedCount);
        setTotalXP(unlockedCount * 10);
    }

    return () => unsubscribeAuth();
  }, [toast]);

  const handleLogNewActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return toast({ variant: "destructive", title: "Not Authenticated" });
    if (!newActivityTitle.trim() || !newActivitySubject.trim()) return toast({ variant: "destructive", title: "Missing Information" });
    
    setIsLoggingActivity(true);
    const result = await logStudyActivity(currentUser.uid, { title: newActivityTitle, subject: newActivitySubject });
    if (result.success) {
      toast({ title: "Activity Logged!" });
      setNewActivityTitle("");
      setNewActivitySubject("");
    } else {
      toast({ variant: "destructive", title: "Logging Failed", description: result.error });
    }
    setIsLoggingActivity(false);
  };
  
  const overallStats = {
    completedPercentage: 0,
    coursesCompleted: 0,
    totalCourses: 0, 
    currentStreak: 0,
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 rounded-2xl shadow-lg border border-primary/20">
          <div className="flex items-center gap-4">
            <BarChart3 className="h-10 w-10 text-primary text-glow" />
            <div>
              <h1 className="text-3xl font-bold text-glow font-heading">My Learning Progress</h1>
              <p className="text-md text-muted-foreground mt-1">
                An overview of your learning journey, achievements, and areas for growth.
              </p>
            </div>
          </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Completion</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-glow">{overallStats.completedPercentage}%</div>
                <p className="text-xs text-muted-foreground">{overallStats.coursesCompleted} / {overallStats.totalCourses || 'N/A'} courses</p>
            </CardContent>
        </Card>
         <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total XP Earned</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-glow">{totalXP} XP</div>
                <p className="text-xs text-muted-foreground">From achievements</p>
            </CardContent>
        </Card>
         <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-glow">{overallStats.currentStreak} Days</div>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
            </CardContent>
        </Card>
         <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-glow">{achievementsUnlocked} / {allPossibleAchievementsList.length}</div>
                 <Link href="/achievements" className="text-xs text-primary hover:underline">View All</Link>
            </CardContent>
        </Card>
      </div>

       <Card className="glass-card">
        <CardHeader>
          <CardTitle>Log New Study Activity</CardTitle>
          <CardDescription>Manually add study sessions you've completed.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogNewActivity} className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <Label htmlFor="activityTitle" className="sr-only">Activity Title</Label>
                <Input 
                  id="activityTitle"
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  placeholder="e.g., Read Chapter 5"
                  disabled={isLoggingActivity}
                />
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="activitySubject" className="sr-only">Subject</Label>
                <Input 
                  id="activitySubject"
                  value={newActivitySubject}
                  onChange={(e) => setNewActivitySubject(e.target.value)}
                  placeholder="e.g., Physics"
                  disabled={isLoggingActivity}
                />
              </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoggingActivity}>
              {isLoggingActivity ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Log Activity
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Learning Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingActivities ? (
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                </div>
            ) : recentActivities.length > 0 ? (
              <ul className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <li key={activity.id || index} className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.subject} - <span className="text-xs">{activity.timestamp.toLocaleDateString()}</span></p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent activity.</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Your progress across different subjects. Will update as you learn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                  <p className="font-medium mb-1">Mathematics</p>
                  <Progress value={0} />
              </div>
               <div>
                  <p className="font-medium mb-1">Science</p>
                  <Progress value={0} />
              </div>
               <div>
                  <p className="font-medium mb-1">History</p>
                  <Progress value={0} />
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
