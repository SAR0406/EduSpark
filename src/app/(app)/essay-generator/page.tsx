
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSignature, Wand2, Loader2, Brain, Lightbulb, Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateEssay } from "@/lib/actions";
import type { GenerateEssayOutput } from "@/ai/flows/essay-generator-flow";
import { Badge } from "@/components/ui/badge";

const essayGeneratorSchema = z.object({
  topic: z.string().min(5, { message: "Topic/prompt must be at least 5 characters." }).max(500, { message: "Topic/prompt must be 500 characters or less." }),
  essayLength: z.enum(['short', 'medium', 'long']).optional(),
  style: z.enum(['academic', 'persuasive', 'narrative', 'descriptive', 'expository']).optional(),
});

type EssayGeneratorFormValues = z.infer<typeof essayGeneratorSchema>;

export default function EssayGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GenerateEssayOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<EssayGeneratorFormValues>({
    resolver: zodResolver(essayGeneratorSchema),
    defaultValues: {
      topic: "",
      essayLength: "medium",
      style: "academic",
    },
  });

  async function onSubmit(values: EssayGeneratorFormValues) {
    setIsLoading(true);
    setGeneratedResult(null);

    const result = await handleGenerateEssay({
      topic: values.topic,
      essayLength: values.essayLength,
      style: values.style,
    });

    if (result.success && result.data) {
      setGeneratedResult(result.data);
      toast({
        title: "Essay Generated! ✒️✨",
        description: result.data.titleSuggestion ? `Suggested Title: ${result.data.titleSuggestion}` : "Your essay is ready below.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Essay 😟",
        description: result.error || "Failed to get essay from the AI. Please try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <FileSignature className="h-10 w-10 text-primary text-glow" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-gradient-primary">AI Essay Generator</h1>
          <p className="text-md text-muted-foreground mt-1">
            Provide a topic, select length and style, and let our AI craft an essay for you.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><Type className="text-primary h-6 w-6"/>Essay Parameters</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Topic / Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'The impact of social media on modern society'"
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
                  name="essayLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Desired Essay Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select length" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short">Short (~250 words)</SelectItem>
                          <SelectItem value="medium">Medium (~500 words)</SelectItem>
                          <SelectItem value="long">Long (~750 words)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Writing Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="persuasive">Persuasive</SelectItem>
                          <SelectItem value="narrative">Narrative</SelectItem>
                          <SelectItem value="descriptive">Descriptive</SelectItem>
                          <SelectItem value="expository">Expository</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t border-border/20 pt-6">
                <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Essay...</>
                  ) : (
                    <><Wand2 className="mr-2 h-5 w-5" /> Generate Essay</>
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
              <h3 className="text-2xl font-semibold text-foreground">AI is Drafting Your Essay...</h3>
              <p className="text-muted-foreground mt-2">This might take a few moments. Please wait!</p>
            </div>
          )}

          {generatedResult && (
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl font-semibold">
                    {generatedResult.titleSuggestion || "Generated Essay"}
                  </CardTitle>
                </div>
                 <div className="mt-2 space-x-2">
                    <Badge variant="outline">Length: {form.getValues("essayLength") || 'Medium'}</Badge>
                    <Badge variant="outline">Style: {form.getValues("style") || 'Academic'}</Badge>
                 </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-5 bg-black/30 rounded-lg border border-border/20 text-base leading-relaxed min-h-[200px]">
                  {generatedResult.essay}
                </div>
              </CardContent>
            </Card>
          )}
          {!isLoading && !generatedResult && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Unlock Your Thoughts</h3>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Define your topic, choose a length and style, and let our AI assistant help you craft a compelling essay.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
