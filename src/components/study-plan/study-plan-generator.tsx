
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { generateStudyPlan } from "@/ai/flows/personalized-study-plans";
import { Loader2, ListChecks, Sparkles, Target, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { awardAchievement } from "@/lib/achievements";

const studyPlanSchema = z.object({
  studentPerformance: z.string().min(10, { message: "Please provide more details about student performance (at least 10 characters)." }).max(2000, { message: "Performance summary must be 2000 characters or less."}),
  learningGoals: z.string().min(10, { message: "Please describe learning goals in more detail (at least 10 characters)." }).max(2000, { message: "Learning goals must be 2000 characters or less."}),
  availableMaterials: z.string().min(10, { message: "Please list available materials (at least 10 characters)." }).max(2000, { message: "Available materials must be 2000 characters or less."}),
});

type StudyPlanFormValues = z.infer<typeof studyPlanSchema>;

export function StudyPlanGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<StudyPlanFormValues>({
    resolver: zodResolver(studyPlanSchema),
    defaultValues: {
      studentPerformance: "",
      learningGoals: "",
      availableMaterials: "",
    },
  });

  async function onSubmit(values: StudyPlanFormValues) {
    setIsLoading(true);
    setGeneratedPlan(null);

    try {
        const data = await generateStudyPlan(values);
        setGeneratedPlan(data.studyPlan);
        toast({
            title: "Study Plan Generated! 🚀",
            description: "Your personalized study plan is ready below.",
        });
        awardAchievement('plannerPro', toast);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error Generating Study Plan 😟",
            description: error instanceof Error ? error.message : "Failed to generate study plan. Please try again.",
        });
    }
    setIsLoading(false);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2"><Target className="text-primary h-6 w-6"/>Your Learning Profile</CardTitle>
          <CardDescription>Provide these details for a tailored plan.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="studentPerformance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-foreground">Student Performance Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Strong in Math, needs improvement in History reading comprehension."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="learningGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-foreground">Learning Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Improve essay writing skills for English. Prepare for upcoming test."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableMaterials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-foreground">Available Learning Materials</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Textbook for History, online video lectures for Math."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t border-border/20 pt-6">
              <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Plan...</>
                ) : (
                  <><Sparkles className="mr-2 h-5 w-5" /> Generate My Study Plan</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="space-y-8">
        {isLoading && !generatedPlan && (
          <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
            <h3 className="text-2xl font-semibold text-glow">AI is Crafting Your Plan...</h3>
            <p className="text-muted-foreground mt-2">Personalizing your path to success!</p>
          </div>
        )}

        {generatedPlan && (
          <Card className="glass-card">
            <CardHeader>
               <div className="flex items-center gap-3">
                  <ListChecks className="h-8 w-8 text-green-500" />
                  <CardTitle className="text-2xl font-semibold">Your Personalized Study Plan</CardTitle>
               </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-5 bg-black/30 rounded-lg border border-border/20 text-base leading-relaxed min-h-[200px]">
                  {generatedPlan}
              </div>
            </CardContent>
          </Card>
        )}
        {!isLoading && !generatedPlan && (
           <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
              <h3 className="text-2xl font-semibold mb-3 text-glow">Chart Your Course to Success</h3>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Fill in your profile on the left. Our AI will then generate a personalized study plan to guide your learning journey!
              </p>
          </div>
         )}
      </div>
    </div>
  );
}
