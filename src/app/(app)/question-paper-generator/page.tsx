
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
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Wand2, Loader2, Lightbulb, BookOpen, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateQuestionPaper } from "@/lib/actions";
import type { QuestionPaperOutput as QuestionPaperOutputType } from "@/ai/flows/question-paper-generator-flow";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { SuggestionCard } from "@/components/ui/suggestion-card";

const classes = ["6th", "7th", "8th", "9th", "10th", "11th (Science)", "11th (Commerce)", "11th (Arts)", "12th (Science)", "12th (Commerce)", "12th (Arts)"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Science", "History", "Geography", "Political Science", "Economics", "Accountancy", "Business Studies", "Computer Science", "Informatics Practices", "Physical Education"];
const examTypes = ["Unit Test", "Mid-Term Exam", "Pre-Board Exam", "Sample Paper", "Final Board Exam"];

const questionPaperGeneratorSchema = z.object({
  className: z.string().min(1, { message: "Please select a class." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  examType: z.string().min(1, { message: "Please select an exam type." }),
  totalMarks: z.coerce.number().int().min(10, { message: "Marks must be at least 10." }).max(100, { message: "Marks cannot exceed 100." }),
  duration: z.string().min(1, { message: "Please specify duration."}),
  specificTopics: z.string().optional(),
  sourceMaterialText: z.string().max(10000, {message: "Source material text cannot exceed 10,000 characters."}).optional(),
});

type QuestionPaperGeneratorFormValues = z.infer<typeof questionPaperGeneratorSchema>;

const formatQuestionPaperAsText = (paper: QuestionPaperOutputType): string => {
  let textContent = `Title: ${paper.title}\n`;
  textContent += `Total Marks: ${paper.totalMarks}\n`;
  textContent += `Duration: ${paper.duration}\n\n`;
  textContent += `General Instructions:\n${paper.generalInstructions}\n\n`;

  paper.sections.forEach((section) => {
    textContent += `--------------------------------------------------\n`;
    textContent += `${section.sectionName.toUpperCase()}\n`;
    if (section.sectionInstructions) {
      textContent += `Instructions: ${section.sectionInstructions}\n`;
    }
    textContent += `--------------------------------------------------\n\n`;

    section.questions.forEach((q, qIndex) => {
      textContent += `Q${qIndex + 1}. (${q.marks} Mark${q.marks > 1 ? 's' : ''}) [${q.questionType}]\n`;
      textContent += `${q.questionText}\n`;
      if (q.questionType === "MCQ" && q.options && q.options.length > 0) {
        q.options.forEach((opt, optIdx) => {
          textContent += `  ${String.fromCharCode(65 + optIdx)}) ${opt}\n`;
        });
      }
      if (q.correctAnswer) {
        textContent += `\nCorrect Answer: ${q.correctAnswer}\n`;
      }
      if (q.answerKeyPoints) {
        textContent += `Key Points: ${q.answerKeyPoints}\n`;
      }
      textContent += `\n\n`;
    });
  });
  return textContent;
};


export default function QuestionPaperGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<QuestionPaperOutputType | null>(null);
  const { toast } = useToast();

  const form = useForm<QuestionPaperGeneratorFormValues>({
    resolver: zodResolver(questionPaperGeneratorSchema),
    defaultValues: {
      className: "",
      subject: "",
      examType: "",
      totalMarks: 70,
      duration: "3 hours",
      specificTopics: "",
      sourceMaterialText: "",
    },
  });

  async function onSubmit(values: QuestionPaperGeneratorFormValues) {
    setIsLoading(true);
    setGeneratedPaper(null);

    const result = await handleGenerateQuestionPaper(values);

    if (result.success && result.data) {
      setGeneratedPaper(result.data);
      toast({
        title: "Question Paper Generated! 📄✨",
        description: "Your AI-crafted question paper is ready below.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Paper 😟",
        description: result.error || "Failed to generate question paper. Please try again.",
      });
    }
    setIsLoading(false);
  }

  const handleDownload = () => {
    if (!generatedPaper) {
      toast({ variant: "destructive", title: "No Paper Generated", description: "Please generate a paper first." });
      return;
    }
    const textContent = formatQuestionPaperAsText(generatedPaper);
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = generatedPaper.title.replace(/[^a-z0-9_]+/gi, '_').toLowerCase() || 'question_paper';
    link.download = `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Download Started!", description: "Your question paper is being downloaded as a text file." });
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full border border-primary/20 text-primary">
            <FileText className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-glow">AI Question Paper Generator</h1>
            <p className="text-md text-muted-foreground mt-1">
              Generate papers based on CBSE patterns, with optional source material.
            </p>
          </div>
        </header>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><Wand2 className="text-primary h-6 w-6"/>Paper Specifications</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-5">
                <FormField
                  control={form.control}
                  name="className"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                        <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
                        <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="examType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Exam Type</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select exam type" /></SelectTrigger></FormControl>
                        <SelectContent>{examTypes.map(et => <SelectItem key={et} value={et}>{et}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="totalMarks"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-medium text-foreground">Total Marks</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 70" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-medium text-foreground">Duration</FormLabel>
                        <FormControl><Input placeholder="e.g., 3 hours" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="specificTopics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Specific Topics (Optional)</FormLabel>
                      <FormControl><Textarea placeholder="e.g., Thermodynamics, Chemical Bonding" className="min-h-[80px] resize-y" {...field}/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField control={form.control} name="sourceMaterialText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Source Material (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste reference text here. The AI will try to base questions on it." className="min-h-[120px] resize-y" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              </CardContent>
              <CardFooter className="border-t border-border/20 pt-6">
                <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold">
                  {isLoading ? <><Loader2 className="mr-2.5 h-5 w-5 animate-spin" /> Generating...</> : <><Wand2 className="mr-2.5 h-5 w-5" /> Generate Paper</>}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && !generatedPaper && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-semibold text-glow">AI is Drafting Your Question Paper...</h3>
              <p className="text-muted-foreground mt-2">Please wait, this may take a few moments!</p>
            </div>
          )}

          {generatedPaper ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            <Card className="glass-card">
              <CardHeader className="border-b border-border/20 pb-5">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary flex-shrink-0" />
                        <CardTitle className="text-2xl font-semibold">{generatedPaper.title}</CardTitle>
                    </div>
                    <Button onClick={handleDownload} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                 </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6 p-4 bg-card/60 rounded-lg border border-border/20">
                  <h3 className="font-semibold text-lg">General Instructions:</h3>
                  <p className="whitespace-pre-wrap text-muted-foreground">{generatedPaper.generalInstructions}</p>
                </div>
                <Separator className="my-6 bg-border/20"/>
                <Accordion type="multiple" className="w-full space-y-3" defaultValue={generatedPaper.sections.map(s => s.sectionName)}>
                  {generatedPaper.sections.map((section, sectionIndex) => (
                    <AccordionItem key={sectionIndex} value={section.sectionName} className="border border-border/30 rounded-lg bg-card/60">
                      <AccordionTrigger className="text-lg font-semibold p-4">
                        <span className="text-left">{section.sectionName}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 py-4 bg-background/50 prose prose-sm dark:prose-invert max-w-none">
                        {section.sectionInstructions && <p className="text-xs text-muted-foreground italic mb-4">{section.sectionInstructions}</p>}
                        {section.questions.map((q, qIndex) => (
                          <div key={qIndex} className="mb-6 pb-5 border-b border-dashed border-border/40 last:border-b-0">
                            <div className="flex justify-between items-start mb-1.5">
                              <p className="font-medium"><strong>Q{qIndex + 1}.</strong> {q.questionText}</p>
                              <Badge variant="secondary" className="ml-2 flex-shrink-0">{q.marks} Mark{q.marks > 1 ? 's' : ''}</Badge>
                            </div>
                            {q.questionType === "MCQ" && q.options && (
                              <ul className="list-none pl-1 space-y-1.5 mt-2 !mb-3">
                                {q.options.map((opt, optIdx) => ( <li key={optIdx}>{String.fromCharCode(65 + optIdx)}) {opt}</li> ))}
                              </ul>
                            )}
                            {(q.correctAnswer || q.answerKeyPoints) && (
                               <div className="mt-3 p-3 bg-green-500/5 rounded-md border border-green-500/20 text-sm">
                                 <strong className="text-green-400 block mb-1">Answer / Key Points:</strong> 
                                 {q.correctAnswer && <p className="text-green-300 whitespace-pre-wrap !my-0">{q.correctAnswer}</p>}
                                 {q.correctAnswer && q.answerKeyPoints && <Separator className="my-2 bg-green-500/20"/>}
                                 {q.answerKeyPoints && <p className="text-green-300 whitespace-pre-wrap !my-0">{q.answerKeyPoints}</p>}
                               </div>
                            )}
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            </motion.div>
          ) : (
            <>
            {!isLoading && (
              <div className="space-y-4">
                <SuggestionCard 
                  title="Pro Tip"
                  message="For the most accurate paper, provide specific chapter names or paste source text from your book into the optional fields."
                />
                <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                    <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
                    <h3 className="text-2xl font-semibold mb-3 text-glow">Generate Your Custom Question Paper</h3>
                    <p className="text-muted-foreground max-w-md leading-relaxed">
                    Fill in the details on the left. You can also paste reference text to guide the AI.
                    </p>
                </div>
              </div>
              )}
            </>
           )}
        </div>
      </div>
    </div>
  );
}
