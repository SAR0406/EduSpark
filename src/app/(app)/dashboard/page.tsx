
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, MessageCircleQuestion, Trophy, Sparkles, Activity, Award, CheckSquare, BarChart3, VenetianMask, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { allPossibleAchievementsList, awardAchievement, getAchievementById } from "@/lib/achievements";
import { auth, db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, Timestamp, type DocumentData, limit } from "firebase/firestore";

interface StudyActivity {
  id: string;
  title: string;
  subject: string;
  timestamp: Date;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [achievementsUnlocked, setAchievementsUnlocked] = React.useState(0);
  const [totalXP, setTotalXP] = React.useState(0);
  const [currentUser, setCurrentUser] = React.useState<FirebaseUser | null>(null);
  const [currentUserName, setCurrentUserName] = React.useState<string>("Learner");
  const [recentActivities, setRecentActivities] = React.useState<StudyActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = React.useState(true);

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.displayName) {
          setCurrentUserName(user.displayName);
        } else if (user.email) {
          setCurrentUserName(user.email.split('@')[0]);
        }
        awardAchievement('firstLogin', toast);

        // Fetch activities
        setIsLoadingActivities(true);
        const activitiesColRef = collection(db, 'users', user.uid, 'studyActivities');
        const q = query(activitiesColRef, orderBy("timestamp", "desc"), limit(5));
        
        const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
          const fetchedActivities: StudyActivity[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            fetchedActivities.push({
              id: doc.id,
              title: data.title,
              subject: data.subject,
              timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
            });
          });
          setRecentActivities(fetchedActivities);
          setIsLoadingActivities(false);
        }, (error) => {
          console.error("Error fetching activities:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not fetch recent activities." });
          setIsLoadingActivities(false);
        });

        return () => unsubscribeFirestore();
      } else {
        setCurrentUserName("Learner");
        setIsLoadingActivities(false);
      }
    });

    if (typeof window !== 'undefined') {
      let unlockedCount = 0;
      let xp = 0;
      
      allPossibleAchievementsList.forEach(achDef => {
          const achievementKey = `eduspark_achievement_${achDef.id}`;
          if (localStorage.getItem(achievementKey) === "true") {
              unlockedCount++;
              const achievement = getAchievementById(achDef.id);
              xp += (achievement?.points || 10); 
          }
      });
      setAchievementsUnlocked(unlockedCount);
      setTotalXP(xp);
    }
    
    return () => unsubscribeAuth();
  }, [toast]);

  const stats = [
    { title: "Courses in Progress", value: "0", icon: BookOpen },
    { title: "Quizzes Taken", value: "0", icon: CheckSquare },
    { title: "Achievements", value: `${achievementsUnlocked}/${allPossibleAchievementsList.length}`, icon: Trophy },
    { title: "XP Earned", value: `${totalXP}`, icon: Sparkles },
  ];
  
  const quickLinks = [
    { title: "AI Tutor", href: "/chatbot", icon: MessageCircleQuestion, description: "Get instant help on any topic." },
    { title: "AI Quiz Generator", href: "/quizzes", icon: VenetianMask, description: "Test your knowledge." },
    { title: "My Progress", href: "/progress", icon: BarChart3, description: "Track your growth." },
    { title: "Achievements", href: "/achievements", icon: Award, description: "View your collection." },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <div className="relative p-8 rounded-2xl overflow-hidden glass-card">
           <Image
            src="https://i.ibb.co/jv7L6yZ/20250521-0854-Edu-Spark-Educational-Banner-simple-compose-01jvrdts8rfppv6ahs7288qtm2.png"
            alt="EduSpark Dashboard Banner"
            layout="fill"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold font-display">Welcome back, {currentUserName}!</h1>
            <p className="text-muted-foreground mt-1">Let's continue your learning journey. What would you like to do today?</p>
          </div>
        </div>
      </motion.div>
    
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-glow">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
          <Card className="glass-card">
             <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Jump right back into your learning activities.</CardDescription>
             </CardHeader>
             <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="group block">
                    <div className="p-4 bg-muted/50 rounded-lg hover:bg-accent transition-colors h-full border border-transparent hover:border-primary/50">
                        <link.icon className="h-6 w-6 text-primary mb-2 transition-transform group-hover:scale-110" />
                        <h4 className="font-semibold">{link.title}</h4>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </Link>
                ))}
             </CardContent>
          </Card>
          <Card className="glass-card flex flex-col">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>An overview of your recent accomplishments.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                {isLoadingActivities ? (
                    <div className="flex-1 flex items-center justify-center h-full text-center text-muted-foreground p-8">
                        <Loader2 className="h-8 w-8 animate-spin"/>
                    </div>
                ) : recentActivities.length > 0 ? (
                    <ul className="space-y-4">
                      {recentActivities.map((activity) => (
                        <li key={activity.id} className="flex items-center gap-4">
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
                    <div className="flex-1 flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 border border-dashed rounded-lg">
                        <Activity className="h-8 w-8 mb-2"/>
                        <p className="text-sm">Your recent activities will show up here.</p>
                        <Button asChild variant="link" size="sm" className="mt-2">
                           <Link href="/progress">Log an activity</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
          </Card>
      </motion.div>
    </div>
  );
}
