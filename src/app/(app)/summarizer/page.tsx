
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlignLeft, Wand2, Loader2, FileText, BookText, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { summarizeText, type SummarizeTextOutput } from "@/ai/flows/summarizer-flow";
import { awardAchievement } from "@/lib/achievements";

const summarizerSchema = z.object({
  chapterName: z.string().optional(),
  textToSummarize: z.string().min(50, { message: "Text to summarize must be at least 50 characters." }).max(10000, { message: "Text to summarize must be 10000 characters or less." }),
  summaryLength: z.enum(['short', 'medium', 'long']).optional(),
});

type SummarizerFormValues = z.infer<typeof summarizerSchema>;

export default function SummarizerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<SummarizeTextOutput | null>(null);
  const { toast } = useToast();
  const [summarizerCount, setSummarizerCount] = React.useState(0);

  const form = useForm<SummarizerFormValues>({
    resolver: zodResolver(summarizerSchema),
    defaultValues: {
      chapterName: "",
      textToSummarize: "",
      summaryLength: "medium",
    },
  });

  async function onSubmit(values: SummarizerFormValues) {
    setIsLoading(true);
    setGeneratedSummary(null);

    try {
        const data = await summarizeText({
            textToSummarize: values.textToSummarize,
            summaryLength: values.summaryLength,
            chapterName: values.chapterName,
        });
        setGeneratedSummary(data);
        toast({
            title: "Summary Generated! ✍️",
            description: "The AI has created a summary for your text below.",
        });
        const newCount = summarizerCount + 1;
        setSummarizerCount(newCount);
        if (newCount >= 1) { 
            awardAchievement('masterSummarizer', toast);
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error Generating Summary 😟",
            description: error instanceof Error ? error.message : "Failed to get summary from the AI. Please try again.",
        });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <AlignLeft className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-glow">AI Text Summarizer</h1>
          <p className="text-md text-muted-foreground mt-1">
            Paste your long text, notes, or articles and let our AI craft a concise summary.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><FileText className="text-primary h-6 w-6"/>Input Your Content</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="chapterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Chapter Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The French Revolution" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="textToSummarize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Text to Summarize</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your long text, article, or notes here..."
                          className="min-h-[200px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summaryLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Desired Summary Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select length" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short">Short (Few sentences)</SelectItem>
                          <SelectItem value="medium">Medium (A paragraph or two)</SelectItem>
                          <SelectItem value="long">Long (More detailed)</SelectItem>
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
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Summarizing...</>
                  ) : (
                    <><Wand2 className="mr-2 h-5 w-5" /> Generate Summary</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && !generatedSummary && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
               <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
               <h3 className="text-2xl font-semibold text-foreground">AI is Condensing Your Text...</h3>
               <p className="text-muted-foreground mt-2">Please wait, this might take a moment!</p>
            </div>
          )}

          {generatedSummary && (
            <Card className="glass-card">
              <CardHeader>
                 <div className="flex items-center gap-3">
                    <BookText className="h-8 w-8 text-green-500" />
                    <CardTitle className="text-2xl font-semibold">Generated Summary</CardTitle>
                 </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-5 bg-black/30 rounded-lg border border-border/20 text-base leading-relaxed">
                    {generatedSummary.summary}
                </div>
              </CardContent>
            </Card>
          )}
           {!isLoading && !generatedSummary && (
             <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">Unlock Key Insights, Instantly</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Paste your content on the left, choose a summary length, and let our AI assistant extract the essence for you.
                </p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}
