
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { MessageSquare, Wand2, Loader2, ThumbsUp, Lightbulb, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suggestDebateTopics, type SuggestDebateTopicsOutput } from "@/ai/flows/debate-topic-suggester-flow";
import { Badge } from "@/components/ui/badge";

const debateTopicSuggesterSchema = z.object({
  subjectArea: z.string().min(3, { message: "Subject area must be at least 3 characters." }).max(100, { message: "Subject area must be 100 characters or less." }),
  numTopics: z.number().min(2).max(7).default(3),
});

type DebateTopicSuggesterFormValues = z.infer<typeof debateTopicSuggesterSchema>;

export default function DebateTopicSuggesterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<SuggestDebateTopicsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<DebateTopicSuggesterFormValues>({
    resolver: zodResolver(debateTopicSuggesterSchema),
    defaultValues: {
      subjectArea: "",
      numTopics: 3,
    },
  });

  async function onSubmit(values: DebateTopicSuggesterFormValues) {
    setIsLoading(true);
    setGeneratedResult(null);

    try {
        const data = await suggestDebateTopics({
            subjectArea: values.subjectArea,
            numTopics: values.numTopics,
        });
        setGeneratedResult(data);
        toast({
            title: "Debate Topics Suggested! 🤔💡",
            description: data.suggestedTitle || "Your debate topics are ready below.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error Suggesting Topics 😟",
            description: error instanceof Error ? error.message : "Failed to get topics from the AI. Please try again.",
        });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Brain className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-glow">AI Debate Topic Suggester</h1>
          <p className="text-md text-muted-foreground mt-1">
            Spark critical thinking! Enter a subject, and our AI will generate engaging debate topics.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><Lightbulb className="text-primary h-6 w-6"/>Topic Parameters</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="subjectArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Subject Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Artificial Intelligence, Climate Change" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numTopics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground flex justify-between items-center">
                        <span>Number of Topics</span>
                        <Badge variant="secondary">{field.value}</Badge>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          min={2}
                          max={7}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="my-4"
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
                    <><Loader2 className="mr-2.5 h-5 w-5 animate-spin" /> Generating...</>
                  ) : (
                    <><Wand2 className="mr-2.5 h-5 w-5" /> Suggest Topics</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && !generatedResult && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-semibold text-glow">AI is Brainstorming...</h3>
              <p className="text-muted-foreground mt-2">Crafting thought-provoking debate topics for you!</p>
            </div>
          )}

          {generatedResult && (
            <Card className="glass-card">
              <CardHeader>
                 <div className="flex items-center gap-3">
                    <ThumbsUp className="h-8 w-8 text-accent" />
                    <CardTitle className="text-2xl font-semibold">
                      {generatedResult.suggestedTitle}
                    </CardTitle>
                 </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {generatedResult.topics.map((topic, index) => (
                    <li key={index} className="p-4 bg-black/30 rounded-lg border border-border/20">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <p className="text-base text-foreground leading-relaxed">{topic}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
           {!isLoading && !generatedResult && (
             <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <Brain className="mx-auto h-20 w-20 text-primary/50 mb-8" />
                <h3 className="text-2xl font-semibold mb-3 text-glow">Ready for a Lively Debate?</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Enter a subject area on the left and our AI will suggest some thought-provoking questions to spark discussion!
                </p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}
