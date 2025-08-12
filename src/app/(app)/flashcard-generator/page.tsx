
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Layers, Wand2, Loader2, Lightbulb, BookCopy, FlipHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateFlashcards } from "@/lib/actions";
import type { GenerateFlashcardsOutput } from "@/ai/flows/flashcard-generator-flow";
import { Badge } from "@/components/ui/badge";
import { awardAchievement } from "@/lib/achievements";

const flashcardGeneratorSchema = z.object({
  sourceText: z.string().min(20, { message: "Source text must be at least 20 characters." }).max(5000, { message: "Source text must be 5000 characters or less." }),
  numFlashcards: z.number().min(3).max(20).default(5),
});

type FlashcardGeneratorFormValues = z.infer<typeof flashcardGeneratorSchema>;

interface FlashcardDisplayState {
  isFlipped: boolean;
}

export default function FlashcardGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GenerateFlashcardsOutput | null>(null);
  const [flashcardStates, setFlashcardStates] = useState<FlashcardDisplayState[]>([]);
  const { toast } = useToast();

  const form = useForm<FlashcardGeneratorFormValues>({
    resolver: zodResolver(flashcardGeneratorSchema),
    defaultValues: {
      sourceText: "",
      numFlashcards: 5,
    },
  });

  async function onSubmit(values: FlashcardGeneratorFormValues) {
    setIsLoading(true);
    setGeneratedResult(null);
    setFlashcardStates([]);

    const result = await handleGenerateFlashcards({
      sourceText: values.sourceText,
      numFlashcards: values.numFlashcards,
    });

    if (result.success && result.data && result.data.flashcards.length > 0) {
      setGeneratedResult(result.data);
      setFlashcardStates(result.data.flashcards.map(() => ({ isFlipped: false })));
      toast({
        title: "Flashcards Generated! 🧠✨",
        description: result.data.suggestedTitle ? `Set Title: ${result.data.suggestedTitle}` : "Your flashcards are ready to study!",
      });
      awardAchievement('flashcardFanatic', toast);
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Flashcards 😟",
        description: result.error || "Failed to create flashcards. Please check your input or try again.",
      });
    }
    setIsLoading(false);
  }

  const toggleFlip = (index: number) => {
    setFlashcardStates(prevStates =>
      prevStates.map((state, i) =>
        i === index ? { ...state, isFlipped: !state.isFlipped } : state
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <Layers className="h-10 w-10 text-primary text-glow" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-gradient-primary">AI Flashcard Generator</h1>
          <p className="text-md text-muted-foreground mt-1">
            Paste your notes, and let AI create interactive flashcards for effective learning.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><BookCopy className="text-primary h-6 w-6"/>Input Content</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="sourceText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Source Text / Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your study material here..."
                          className="min-h-[180px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numFlashcards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground flex justify-between items-center">
                        <span>Number of Flashcards</span>
                        <Badge variant="secondary">{field.value}</Badge>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          min={3}
                          max={20}
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
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
                  ) : (
                    <><Wand2 className="mr-2 h-5 w-5" /> Create Flashcards</>
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
              <h3 className="text-2xl font-semibold text-foreground">AI is Crafting Your Flashcards...</h3>
              <p className="text-muted-foreground mt-2">Get ready for some smart studying!</p>
            </div>
          )}

          {generatedResult && generatedResult.flashcards.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                 <div className="flex items-center gap-3">
                    <Layers className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-semibold">
                      {generatedResult.suggestedTitle || "Generated Flashcards"}
                    </CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedResult.flashcards.map((card, index) => (
                  <div
                    key={index}
                    className="relative aspect-[3/2] perspective group cursor-pointer"
                    onClick={() => toggleFlip(index)}
                  >
                    <div
                      className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition-transform duration-700 ease-in-out preserve-3d backface-hidden
                        ${flashcardStates[index]?.isFlipped ? 'rotate-y-180' : ''}
                        bg-card/70 border border-border/20`}
                    >
                      <p className="text-lg font-medium text-foreground">{card.question}</p>
                    </div>
                    <div
                       className={`absolute inset-0 w-full h-full rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition-transform duration-700 ease-in-out preserve-3d backface-hidden
                        ${flashcardStates[index]?.isFlipped ? '' : 'rotate-y-180'}
                        bg-primary/90 text-primary-foreground border border-primary/50`}
                    >
                      <p className="text-md">{card.answer}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-muted-foreground group-hover:text-primary z-10 bg-card/50 hover:bg-card/80 rounded-full" title="Flip card">
                        <FlipHorizontal size={16} />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {!isLoading && (!generatedResult || generatedResult.flashcards.length === 0) && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Boost Your Memory</h3>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Paste your notes on the left, and our AI will create interactive flashcards for you.
              </p>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
