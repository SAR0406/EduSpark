
"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label"; 
import { HelpCircle, Brain, Loader2, ListChecks, CheckSquare, VenetianMask, CheckCircle, XCircle, Award, Wand2, Lightbulb, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateQuiz, handleVerifyQuizAnswers } from "@/lib/actions";
import type { GenerateQuizOutput } from "@/lib/actions";
import type { VerifiedQuestionResult } from "@/lib/actions";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { awardAchievement } from "@/lib/achievements"; 
import { SuggestionCard } from "@/components/ui/suggestion-card";
import { motion, AnimatePresence } from "framer-motion";

const quizGeneratorSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).max(100, { message: "Topic must be 100 characters or less." }),
  contextText: z.string().optional(),
  numQuestions: z.number().min(1).max(10),
});

type QuizGeneratorFormValues = z.infer<typeof quizGeneratorSchema>;

export default function QuizGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GenerateQuizOutput | null>(null);
  const { toast } = useToast();

  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizWhizCount, setQuizWhizCount] = useState(0);
  const [verifiedResults, setVerifiedResults] = useState<VerifiedQuestionResult[] | null>(null);

  const form = useForm<QuizGeneratorFormValues>({
    resolver: zodResolver(quizGeneratorSchema),
    defaultValues: {
      topic: "",
      contextText: "",
      numQuestions: 5,
    },
  });

  useEffect(() => {
    if (generatedQuiz) {
      setUserAnswers(new Array(generatedQuiz.questions.length).fill(null));
      setQuizSubmitted(false);
      setScore(0);
      setVerifiedResults(null); 
    }
  }, [generatedQuiz]);

  async function onSubmit(values: QuizGeneratorFormValues) {
    setIsLoading(true);
    setGeneratedQuiz(null); 
    setQuizSubmitted(false);

    const result = await handleGenerateQuiz({
      topic: values.topic,
      contextText: values.contextText,
      numQuestions: values.numQuestions,
    });

    setIsLoading(false);
    if (result.success && result.data) {
      setGeneratedQuiz(result.data);
      toast({
        title: "Quiz Generated! 🧠✨",
        description: "Your AI-crafted quiz is ready below.",
      });
      const newCount = quizWhizCount + 1;
      setQuizWhizCount(newCount);
      if (newCount >= 1) awardAchievement('quizWhiz', toast);
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Quiz 😟",
        description: result.error || "Failed to generate quiz.",
      });
    }
  }

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    if (quizSubmitted) return; 
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = async () => {
    if (!generatedQuiz) return;
    
    setIsVerifying(true);
    setQuizSubmitted(true);

    const questionsAndUserAnswers = generatedQuiz.questions.map((q, index) => ({
        questionText: q.question,
        options: q.options,
        userSelectedOptionIndex: userAnswers[index],
    }));

    const verificationResult = await handleVerifyQuizAnswers({ questionsAndUserAnswers });

    let finalScore = 0;
    if (verificationResult.success && verificationResult.data) {
        setVerifiedResults(verificationResult.data.verifiedResults);
        verificationResult.data.verifiedResults.forEach(res => {
            if (res.isUserChoiceCorrect) finalScore++;
        });
        toast({ title: `Quiz Submitted!`, description: `You scored ${finalScore} out of ${generatedQuiz.questions.length}. AI-verified answers below.` });
    } else {
        generatedQuiz.questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswerIndex) finalScore++;
        });
        toast({ variant: "destructive", title: "AI Verification Failed", description: `Showing results based on initial AI generation. You scored ${finalScore} out of ${generatedQuiz.questions.length}.` });
    }
    
    setScore(finalScore);
    awardAchievement('quizNovice', toast);
    if (finalScore === generatedQuiz.questions.length) {
        awardAchievement('perfectTen', toast);
    }
    setIsVerifying(false);
  };

  const getOptionClassName = (qIndex: number, optIndex: number) => {
    if (!quizSubmitted) return 'bg-muted/30 hover:bg-muted/70 border-border/20';
    
    const correctIndex = verifiedResults?.[qIndex]?.verifiedCorrectAnswerIndex ?? generatedQuiz?.questions[qIndex].correctAnswerIndex;
    const isCorrect = optIndex === correctIndex;
    const isSelected = userAnswers[qIndex] === optIndex;

    if (isCorrect) return 'bg-green-500/20 border-green-500/50 text-green-300 font-medium ring-2 ring-green-500';
    if (isSelected && !isCorrect) return 'bg-red-500/20 border-red-500/50 text-red-300 ring-2 ring-red-500';
    return 'bg-muted/30 border-border/20 opacity-60 cursor-not-allowed';
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full border border-primary/20 text-primary">
            <VenetianMask className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-glow">AI Quiz Generator & Verifier</h1>
          <p className="text-md text-muted-foreground mt-1">
            Craft quizzes, test your knowledge, and get AI-verified answers and explanations.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><Info className="text-primary h-6 w-6"/>Quiz Parameters</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField control={form.control} name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Quiz Topic</FormLabel>
                      <FormControl><Input placeholder="e.g., The Solar System" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField control={form.control} name="contextText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Context / Source Text (Optional)</FormLabel>
                      <FormControl><Textarea placeholder="Paste relevant text here for a more focused quiz..." className="min-h-[120px] resize-y" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField control={form.control} name="numQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground flex justify-between items-center">
                        <span>Number of MCQs</span>
                        <Badge variant="secondary">{field.value}</Badge>
                      </FormLabel>
                      <FormControl><Slider value={[field.value]} min={1} max={10} step={1} onValueChange={(v) => field.onChange(v[0])} className="my-4" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              </CardContent>
              <CardFooter className="border-t border-white/10 pt-6">
                <Button type="submit" disabled={isLoading || isVerifying} className="w-full h-11 text-base font-semibold">
                  {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</> : <><Wand2 className="mr-2 h-5 w-5" /> Generate New Quiz</>}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
          {(isLoading || isVerifying) && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
                <h3 className="text-2xl font-semibold text-glow">{isLoading ? "AI is Crafting Your Quiz..." : "AI is Verifying Answers..."}</h3>
                <p className="text-muted-foreground mt-2">{isLoading ? "Please wait a moment!" : "Checking your knowledge with AI precision!"}</p>
            </div>
            </motion.div>
          )}
          </AnimatePresence>

          <AnimatePresence>
          {generatedQuiz && !isLoading && !isVerifying && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
            <Card className="glass-card">
              <CardHeader className="border-b border-white/10">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <ListChecks className="h-8 w-8 text-primary flex-shrink-0" />
                        <CardTitle className="text-2xl font-semibold">{generatedQuiz.quizTitle}</CardTitle>
                    </div>
                    {quizSubmitted && (
                        <Badge variant={score === generatedQuiz.questions.length ? "default" : "secondary"} className="text-lg p-2 px-4 rounded-md">
                           <Award className="mr-2 h-5 w-5" /> Score: {score} / {generatedQuiz.questions.length}
                        </Badge>
                    )}
                 </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full space-y-3"
                >
                <Accordion type="multiple" defaultValue={generatedQuiz.questions.map((_,idx) => `q-${idx}`)}>
                  {generatedQuiz.questions.map((q, index) => (
                    <motion.div variants={itemVariants} key={`q-motion-${index}`}>
                    <AccordionItem value={`q-${index}`} className="border-white/10 rounded-lg bg-card/60">
                      <AccordionTrigger className="text-lg font-medium p-4 text-left">
                        <div className="flex items-center gap-3 w-full">
                           {quizSubmitted ? (
                             (verifiedResults?.[index]?.isUserChoiceCorrect) ? 
                             <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" /> :
                             <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                           ) : (
                            <HelpCircle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                           )}
                           <span className="flex-1">{q.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 pb-4 px-4 md:px-6 bg-background/50">
                        <RadioGroup value={userAnswers[index]?.toString()} onValueChange={(v) => handleAnswerChange(index, parseInt(v))} disabled={quizSubmitted} className="space-y-3 mt-2">
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex} className={`flex items-center space-x-3 p-3 rounded-md border transition-all ${getOptionClassName(index, optIndex)}`}>
                              <RadioGroupItem value={optIndex.toString()} id={`q-${index}-opt-${optIndex}`} />
                              <Label htmlFor={`q-${index}-opt-${optIndex}`} className="font-normal flex-1 cursor-pointer">{opt}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {quizSubmitted && (
                          <div className="mt-6 pt-4 border-t border-white/10">
                            <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Lightbulb className="h-5 w-5 text-yellow-500"/>
                              Explanation {verifiedResults ? "(AI Verified)" : "(Initial)"}:
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                              {verifiedResults ? verifiedResults[index]?.explanation : q.explanation}
                            </p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
                </motion.div>
                {!quizSubmitted && (
                  <Button onClick={handleSubmitQuiz} className="mt-8 w-full h-11 text-base font-semibold" disabled={userAnswers.some(a => a === null)}>
                    <CheckSquare className="mr-2 h-5 w-5"/>Submit Quiz & Verify
                  </Button>
                )}
                 {quizSubmitted && (
                    <Button onClick={() => { form.handleSubmit(onSubmit)(); }} className="mt-8 w-full h-11 text-base font-semibold" variant="outline">
                        <Wand2 className="mr-2 h-5 w-5"/>Generate Another Quiz
                    </Button>
                )}
              </CardContent>
            </Card>
            </motion.div>
          )}
          </AnimatePresence>

           <AnimatePresence>
           {!isLoading && !isVerifying && !generatedQuiz && (
            <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
             >
             <div className="space-y-4">
                <SuggestionCard
                    title="Suggestion"
                    message="To get a quiz tailored to your textbook, paste a section from your notes into the 'Context' box before generating."
                />
                <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                    <Brain className="mx-auto h-20 w-20 text-primary/50 mb-8" />
                    <h3 className="text-2xl font-semibold mb-3 text-glow">Ready to Test Your Knowledge?</h3>
                    <p className="text-muted-foreground max-w-md leading-relaxed">
                    Use the panel on the left to generate a new quiz and challenge yourself!
                    </p>
                </div>
            </div>
            </motion.div>
           )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
