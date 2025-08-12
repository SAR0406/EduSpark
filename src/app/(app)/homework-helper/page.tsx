
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Brain, Loader2, CheckCircle, Wand2, Lightbulb, BookOpen, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleSolveMathProblem } from "@/lib/actions";
import type { HomeworkHelperOutput } from "@/ai/flows/homework-helper-flow";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { awardAchievement } from "@/lib/achievements";

const homeworkHelperSchema = z.object({
  problemStatement: z.string().min(3, { message: "Problem statement must be at least 3 characters." }).max(1000, {message: "Problem statement must be 1000 characters or less."}),
});

type HomeworkHelperFormValues = z.infer<typeof homeworkHelperSchema>;

export default function HomeworkHelperPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<HomeworkHelperOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<HomeworkHelperFormValues>({
    resolver: zodResolver(homeworkHelperSchema),
    defaultValues: {
      problemStatement: "",
    },
  });

  async function onSubmit(values: HomeworkHelperFormValues) {
    setIsLoading(true);
    setSolution(null);

    const result = await handleSolveMathProblem({
      problemStatement: values.problemStatement,
    });

    if (result.success && result.data) {
      setSolution(result.data);
      toast({
        title: "Problem Solved! 🧠✨",
        description: "The AI has provided a solution and explanation below.",
      });
      awardAchievement('mathSolver', toast);
    } else {
      toast({
        variant: "destructive",
        title: "Error Solving Problem 😟",
        description: result.error || "The AI couldn't solve this problem. Please check your input or try rephrasing.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <Calculator className="h-10 w-10 text-primary text-glow" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-gradient-primary">AI Homework Helper</h1>
          <p className="text-md text-muted-foreground mt-1">
            Stuck on a math problem? Enter it below for a step-by-step solution.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><Edit2 className="text-primary h-6 w-6"/>Enter Your Math Problem</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="problemStatement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Problem Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Solve for x: 2x + 5 = 15"
                          className="min-h-[180px] resize-y"
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
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Solving...</>
                  ) : (
                    <><Wand2 className="mr-2 h-5 w-5" /> Solve Problem</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && !solution && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
               <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
               <h3 className="text-2xl font-semibold text-foreground">AI is Crunching the Numbers...</h3>
               <p className="text-muted-foreground mt-2">Please wait while we prepare your solution!</p>
            </div>
          )}

          {solution && (
            <Card className="glass-card">
              <CardHeader>
                 <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <CardTitle className="text-2xl font-semibold">Solution Found!</CardTitle>
                 </div>
                {solution.problemType && (
                    <CardDescription className="mt-2 text-md text-muted-foreground">
                        Identified Problem Type: <Badge variant="outline">{solution.problemType}</Badge>
                    </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary"/>
                        Step-by-Step Solution:
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-4 bg-black/30 rounded-lg border border-border/20 text-base leading-relaxed">
                        {solution.stepByStepSolution}
                    </div>
                </div>
                <Separator className="my-6 bg-border/20" />
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Calculator className="h-6 w-6 text-primary"/>
                        Final Answer:
                    </h3>
                    <div className="prose prose-lg dark:prose-invert max-w-none p-4 bg-green-500/10 rounded-lg border border-green-500/30 text-green-300">
                        <p className="font-bold text-xl m-0">{solution.finalAnswer}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          )}
           {!isLoading && !solution && (
             <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">Ready to Conquer That Math Problem?</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Enter your math challenge in the panel on the left. Our AI assistant is eager to help you understand it, step by step!
                </p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}
