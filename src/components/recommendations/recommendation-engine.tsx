
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handleRecommendContent } from "@/lib/actions";
import { Loader2, Search, Sparkles, ThumbsUp, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const recommendationSchema = z.object({
  learningHistory: z.string().min(10, { message: "Please provide more details about your learning history (at least 10 characters)." }).max(2000, { message: "Learning history must be 2000 characters or less."}),
  preferences: z.string().min(10, { message: "Please describe your preferences in more detail (at least 10 characters)." }).max(2000, { message: "Preferences must be 2000 characters or less."}),
});

type RecommendationFormValues = z.infer<typeof recommendationSchema>;

export function RecommendationEngine() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      learningHistory: "",
      preferences: "",
    },
  });

  async function onSubmit(values: RecommendationFormValues) {
    setIsLoading(true);
    setRecommendations(null);

    const result = await handleRecommendContent(values);

    if (result.success && result.data) {
      setRecommendations(result.data.recommendedMaterials);
      toast({
        title: "Recommendations Ready! ✨",
        description: "We've found some learning materials tailored for you.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error Getting Recommendations 😟",
        description: result.error || "Failed to get recommendations. Please try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2"><Search className="text-primary h-6 w-6"/>Tell Us About Yourself</CardTitle>
          <CardDescription>The more details you provide, the better the recommendations!</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="learningHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-foreground">Your Learning History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Completed courses on Algebra and Basic Chemistry. Scored well in Biology quizzes..."
                        className="min-h-[120px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-foreground">Preferences & Interests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Interested in Space Exploration and Computer Programming. Prefers video-based learning..."
                        className="min-h-[120px] resize-y"
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
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finding Recommendations...</>
                ) : (
                  <><Sparkles className="mr-2 h-5 w-5" /> Get My Recommendations</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

        <div className="space-y-8">
         {isLoading && !recommendations && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-semibold text-glow">AI is Searching For You...</h3>
              <p className="text-muted-foreground mt-2">Curating personalized learning suggestions...</p>
            </div>
          )}

          {recommendations && (
            <Card className="glass-card">
              <CardHeader>
                 <div className="flex items-center gap-3">
                    <ThumbsUp className="h-8 w-8 text-green-500" />
                    <CardTitle className="text-2xl font-semibold">Personalized For You!</CardTitle>
                 </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-5 bg-black/30 rounded-lg border border-border/20 text-base leading-relaxed min-h-[200px]">
                  {recommendations}
                </div>
              </CardContent>
            </Card>
          )}
          {!isLoading && !recommendations && (
             <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
                <h3 className="text-2xl font-semibold mb-3 text-glow">Unlock Tailored Learning</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Share your learning history and interests on the left, and let our AI suggest new topics and resources just for you.
                </p>
            </div>
           )}
        </div>
    </div>
  );
}
