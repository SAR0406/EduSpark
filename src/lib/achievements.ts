
import type { Achievement } from "@/app/(app)/achievements/page"; // Assuming type is exported there or define here
import { Award, BookOpen, Brain, BrainCircuit, Calculator, Code2, Feather, Layers, MessageCircle, ShieldCheck, Star, VenetianMask, Zap, AlignLeft } from "lucide-react";
import type { ToastProps } from "@/components/ui/toast"; // For toast type

export const allPossibleAchievementsList: Achievement[] = [
  { id: "firstLogin", title: "First Steps Login! 🚶", description: "Logged in for the first time. Welcome aboard!", icon: Star, color: "text-yellow-500 dark:text-yellow-300", bgColor: "bg-yellow-500/10", points: 10 },
  { id: "courseCadet", title: "Course Cadet Graduate 🧑‍🎓", description: "Completed your first course module.", icon: BookOpen, color: "text-blue-500 dark:text-blue-400", bgColor: "bg-blue-500/10", points: 20 },
  { id: "quizNovice", title: "Quiz Novice Ace 💡", description: "Attempted your first quiz and learned something new!", icon: Zap, color: "text-green-500 dark:text-green-400", bgColor: "bg-green-500/10", points: 15 },
  { id: "perfectTen", title: "Perfect Ten Scorer ✨", description: "Scored 100% on a quiz. Flawless victory!", icon: Award, color: "text-purple-500 dark:text-purple-400", bgColor: "bg-purple-500/10", points: 50 },
  { id: "studyStreak", title: "Study Streak Master 🔥", description: "Logged in 7 days in a row. Consistency is key!", icon: Zap, color: "text-orange-500 dark:text-orange-400", bgColor: "bg-orange-500/10", points: 100 },
  { id: "contentExplorer", title: "Content Explorer Pro 🗺️", description: "Viewed 10 different learning materials. Curious mind!", icon: BookOpen, color: "text-teal-500 dark:text-teal-400", bgColor: "bg-teal-500/10", points: 25 },
  { id: "aiCompanion", title: "AI Companion User 🤖", description: "Asked the AI Chatbot your first question.", icon: MessageCircle, color: "text-indigo-500 dark:text-indigo-400", bgColor: "bg-indigo-500/10", points: 20 },
  { id: "plannerPro", title: "Planner Pro Strategist 🗓️", description: "Generated your first personalized study plan.", icon: ShieldCheck, color: "text-pink-500 dark:text-pink-400", bgColor: "bg-pink-500/10", points: 30 },
  { id: "quizWhiz", title: "Quiz Whiz Kid 🧠", description: "Generated your first quiz using the AI Quiz Generator.", icon: VenetianMask, color: "text-cyan-500 dark:text-cyan-400", bgColor: "bg-cyan-500/10", points: 25 },
  { id: "masterSummarizer", title: "Master Summarizer ✍️", description: "Summarized your first text with the AI Summarizer.", icon: AlignLeft, color: "text-lime-500 dark:text-lime-400", bgColor: "bg-lime-500/10", points: 25 },
  { id: "buddingAuthor", title: "Budding Author 🖋️", description: "Crafted your first story with the Story Weaver.", icon: Feather, color: "text-rose-500 dark:text-rose-400", bgColor: "bg-rose-500/10", points: 20 },
  { id: "conceptConnoisseur", title: "Concept Connoisseur 🎨", description: "Visualized your first concept using the AI Concept Visualizer.", icon: BrainCircuit, color: "text-fuchsia-500 dark:text-fuchsia-400", bgColor: "bg-fuchsia-500/10", points: 30 },
  { id: "mathSolver", title: "Math Problem Solver 🧮", description: "Solved your first problem with the Homework Helper.", icon: Calculator, color: "text-sky-500 dark:text-sky-400", bgColor: "bg-sky-500/10", points: 15 },
  { id: "codeApprentice", title: "Code Apprentice 🧑‍💻", description: "Generated code for a programming task.", icon: Code2, color: "text-amber-500 dark:text-amber-400", bgColor: "bg-amber-500/10", points: 25 },
  { id: "flashcardFanatic", title: "Flashcard Fanatic 🃏", description: "Created a set of flashcards from your notes.", icon: Layers, color: "text-violet-500 dark:text-violet-400", bgColor: "bg-violet-500/10", points: 20 },
];

// Helper to get a specific achievement definition by ID
export const getAchievementById = (id: string): (Achievement & { points?: number }) | undefined => {
  return allPossibleAchievementsList.find(ach => ach.id === id);
};

// Helper function to award an achievement
export const awardAchievement = (achievementId: string, toast: (options: ToastProps) => void) => {
  if (typeof window !== 'undefined') {
    const key = `eduspark_achievement_${achievementId}`;
    if (localStorage.getItem(key) !== "true") {
      localStorage.setItem(key, "true");
      const achievement = getAchievementById(achievementId);
      if (achievement) {
        toast({
          title: "🏆 Achievement Unlocked! 🎉",
          description: achievement.title,
          className: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
        });
      }
    }
  }
};
