
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Share2, Wand2, Loader2, Image as ImageIcon, Lightbulb, AlertCircle } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { visualizeConcept, type VisualizeConceptOutput } from "@/ai/flows/concept-visualizer-flow";
import NextImage from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { awardAchievement } from "@/lib/achievements";

const visualizerSchema = z.object({
  conceptDescription: z.string().min(3, { message: "Concept description must be at least 3 characters." }).max(500, { message: "Concept description must be 500 characters or less." }),
});

type VisualizerFormValues = z.infer<typeof visualizerSchema>;

export default function ConceptVisualizerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState<VisualizeConceptOutput | null>(null);
  const { toast } = useToast();
  const [conceptCount, setConceptCount] = React.useState(0);

  const form = useForm<VisualizerFormValues>({
    resolver: zodResolver(visualizerSchema),
    defaultValues: {
      conceptDescription: "",
    },
  });

  async function onSubmit(values: VisualizerFormValues) {
    setIsLoading(true);
    setGeneratedVisual(null);

    try {
        const data = await visualizeConcept({
          conceptDescription: values.conceptDescription,
        });

        if (data && data.imageDataUri) {
          setGeneratedVisual(data);
          toast({
            title: "Concept Illustrated! 🖼️✨",
            description: data.textFeedback || "The AI has generated a visual for your concept.",
          });
          const newCount = conceptCount + 1;
          setConceptCount(newCount);
          if (newCount >= 1) { 
            awardAchievement('conceptConnoisseur', toast);
          }
        } else {
            throw new Error("AI did not return a valid image.");
        }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error Illustrating Concept 😟",
        description: error instanceof Error ? error.message : "Failed to get visual from the AI. Please ensure your concept is clear or try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
          <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Share2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-glow">AI Diagram & Concept Illustrator</h1>
            <p className="text-md text-muted-foreground mt-1">
              Enter a concept, and our AI will generate a 2D visual (diagram, flowchart, or illustration).
            </p>
          </div>
        </div>

      <Alert variant="default" className="border-accent/50 bg-accent/10 text-accent-foreground [&>svg]:text-accent">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="font-semibold">2D Image Output Only</AlertTitle>
        <AlertDescription>
          This tool generates a static 2D image to illustrate your concept. It does not produce interactive 3D models.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><Share2 className="text-primary h-6 w-6"/>Describe Your Concept</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="conceptDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Concept Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'How photosynthesis works, including reactants and products.' or 'An isometric view of a DNA double helix.'"
                          className="min-h-[150px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t border-border/50 pt-6">
                <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold">
                  {isLoading ? (
                    <><Loader2 className="mr-2.5 h-5 w-5 animate-spin" /> Illustrating...</>
                  ) : (
                    <><Wand2 className="mr-2.5 h-5 w-5" /> Illustrate Concept</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && !generatedVisual && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
                <h3 className="text-2xl font-semibold text-foreground">AI is Sketching Your Concept...</h3>
                <p className="text-muted-foreground mt-2">Please wait while we create a visual representation!</p>
            </div>
          )}

          {generatedVisual && generatedVisual.imageDataUri && (
            <Card className="glass-card">
              <CardHeader>
                 <div className="flex items-center gap-3">
                    <ImageIcon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-semibold">Generated Illustration</CardTitle>
                 </div>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[16/10] w-full border border-border/50 rounded-lg overflow-hidden bg-muted/40 group">
                  <NextImage
                    src={generatedVisual.imageDataUri}
                    alt={`Illustration of ${form.getValues("conceptDescription")}`}
                    layout="fill"
                    objectFit="contain"
                    className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                    data-ai-hint="concept diagram"
                  />
                </div>
              </CardContent>
            </Card>
          )}
           {!isLoading && !generatedVisual && (
             <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
                <h3 className="text-2xl font-semibold mb-3 text-foreground">See Your Ideas Illustrated</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Describe any concept on the left, and our AI assistant will generate a visual to help you grasp it.
                </p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}
