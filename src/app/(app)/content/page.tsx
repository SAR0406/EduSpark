
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Brain, Loader2, HelpCircle, FileText, CheckSquare, Wand2, FileSearch, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateChapterMaterial } from "@/lib/actions";
import type { ChapterMaterialOutput } from "@/ai/flows/chapter-material-generator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const classes = ["6th", "7th", "8th", "9th", "10th", "11th", "12th", "NEET", "JEE"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "English", "Computer Science", "Economics", "Civics", "General Knowledge"];

const chapterMaterialSchema = z.object({
  selectedClass: z.string().min(1, { message: "Please select a class." }),
  selectedSubject: z.string().min(1, { message: "Please select a subject." }),
  chapterName: z.string().min(3, { message: "Chapter name must be at least 3 characters." }).max(100, {message: "Chapter name must be 100 characters or less."}),
});

type ChapterMaterialFormValues = z.infer<typeof chapterMaterialSchema>;

export default function ContentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ChapterMaterialOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ChapterMaterialFormValues>({
    resolver: zodResolver(chapterMaterialSchema),
    defaultValues: {
      selectedClass: "",
      selectedSubject: "",
      chapterName: "",
    },
  });

  async function onSubmit(values: ChapterMaterialFormValues) {
    setIsLoading(true);
    setGeneratedContent(null);

    const result = await handleGenerateChapterMaterial({
      className: values.selectedClass,
      subject: values.selectedSubject,
      chapterName: values.chapterName,
    });

    if (result.success && result.data) {
      setGeneratedContent(result.data);
      toast({
        title: "Content Generated! 🧠",
        description: "Study materials for your chapter are ready below.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Content",
        description: result.error || "Failed to generate study materials. Please try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
       <header className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full border border-primary/20 text-primary">
            <Brain className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-glow">Chapter Material Generator</h1>
            <p className="text-md text-muted-foreground mt-1">
              Generate a summary, questions, and MCQs for any chapter using AI.
            </p>
          </div>
        </header>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><FileSearch className="text-primary h-6 w-6"/>Specify Chapter Details</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="selectedClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class/exam" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls} value={cls}>{cls}{!["NEET", "JEE"].includes(cls) ? " Grade" : ""}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="selectedSubject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((sub) => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chapterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Chapter Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Photosynthesis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t border-border/20 pt-6">
                <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
                  ) : (
                    <><Wand2 className="mr-2 h-5 w-5" /> Generate Materials</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && !generatedContent && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-semibold text-glow">AI is Brewing Your Study Materials...</h3>
              <p className="text-muted-foreground mt-2">This might take a few moments. Please wait!</p>
            </div>
          )}

          {generatedContent && (
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            <Card className="glass-card">
              <CardHeader>
                 <div className="flex items-center gap-3 mb-1">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-semibold">Generated Study Materials</CardTitle>
                 </div>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full space-y-2" defaultValue={["summary", "questions", "mcqs"]}>
                  {generatedContent.summary && (
                    <AccordionItem value="summary" className="border-border/30 rounded-lg bg-card/60">
                      <AccordionTrigger className="text-lg font-medium p-4">
                        <div className="flex items-center gap-3">
                           <FileText className="h-6 w-6 text-primary" /> Chapter Summary
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-4 bg-background/50">
                        {generatedContent.summary}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {generatedContent.questions && generatedContent.questions.length > 0 && (
                    <AccordionItem value="questions" className="border-border/30 rounded-lg bg-card/60">
                      <AccordionTrigger className="text-lg font-medium p-4">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="h-6 w-6 text-primary" /> Practice Questions
                        </div>
                        </AccordionTrigger>
                      <AccordionContent className="p-4 bg-background/50">
                        <ul className="list-decimal pl-6 space-y-3 prose prose-sm dark:prose-invert max-w-none">
                          {generatedContent.questions.map((q, index) => (
                            <li key={`q-${index}`}>{q}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {generatedContent.mcqs && generatedContent.mcqs.length > 0 && (
                    <AccordionItem value="mcqs" className="border-border/30 rounded-lg bg-card/60">
                      <AccordionTrigger className="text-lg font-medium p-4">
                        <div className="flex items-center gap-3">
                            <CheckSquare className="h-6 w-6 text-primary" /> Multiple Choice Questions
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 p-4 bg-background/50">
                        {generatedContent.mcqs.map((mcq, index) => (
                          <div key={`mcq-${index}`} className="prose prose-sm dark:prose-invert max-w-none border-b border-border/50 pb-4 last:border-b-0 last:pb-0">
                            <p className="font-medium"><strong>Q{index + 1}:</strong> {mcq.question}</p>
                            <ul className="list-none pl-1 space-y-2 mt-2">
                              {mcq.options.map((opt, optIndex) => (
                                <li key={`mcq-${index}-opt-${optIndex}`} className={`flex items-center gap-2 ${optIndex === mcq.correctAnswerIndex ? 'font-semibold text-primary' : ''}`}>
                                  <span>{String.fromCharCode(65 + optIndex)}.</span>
                                  {opt}
                                  {optIndex === mcq.correctAnswerIndex && <Badge variant="outline" className="ml-2 border-primary text-primary bg-primary/10">Correct</Badge>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
            </motion.div>
          )}
            {!isLoading && !generatedContent && (
             <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
                <h3 className="text-2xl font-semibold mb-3 text-glow">Unlock Chapter Insights</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Select a class, subject, and chapter on the left. Our AI will generate a summary, practice questions, and MCQs for you.
                </p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}
