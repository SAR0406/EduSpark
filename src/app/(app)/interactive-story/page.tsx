
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
import { Wand2, Loader2, BookOpen, Feather, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateInteractiveStory, type GenerateStoryOutput } from "@/ai/flows/interactive-story-generator-flow";
import { Badge } from "@/components/ui/badge";
import { awardAchievement } from "@/lib/achievements";

const storyGeneratorSchema = z.object({
  mainCharacter: z.string().min(2, { message: "Main character name must be at least 2 characters." }).max(50),
  setting: z.string().min(3, { message: "Setting description must be at least 3 characters." }).max(100),
  genre: z.enum(['fantasy', 'sci-fi', 'mystery', 'adventure', 'comedy', 'drama'], { required_error: "Please select a genre."}),
  storyLength: z.enum(['short', 'medium', 'long']).optional(),
});

type StoryGeneratorFormValues = z.infer<typeof storyGeneratorSchema>;

export default function InteractiveStoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<GenerateStoryOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<StoryGeneratorFormValues>({
    resolver: zodResolver(storyGeneratorSchema),
    defaultValues: {
      mainCharacter: "",
      setting: "",
      genre: undefined,
      storyLength: "short",
    },
  });

  async function onSubmit(values: StoryGeneratorFormValues) {
    setIsLoading(true);
    setGeneratedStory(null);

    try {
        const data = await generateInteractiveStory({
            mainCharacter: values.mainCharacter,
            setting: values.setting,
            genre: values.genre,
            storyLength: values.storyLength,
        });
        setGeneratedStory(data);
        toast({
            title: "Story Generated! 📖✨",
            description: `"${data.title}" is ready for you to read.`,
        });
        awardAchievement('buddingAuthor', toast);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error Generating Story 😟",
            description: error instanceof Error ? error.message : "Failed to get story from the AI. Please try again.",
        });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Feather className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-glow">AI Interactive Story Weaver</h1>
          <p className="text-md text-muted-foreground mt-1">
            Craft your own unique narrative! Provide a character, setting, and genre to bring your story to life.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><Wand2 className="text-primary h-6 w-6"/>Story Ingredients</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="mainCharacter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Main Character Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Elara the Explorer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="setting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Setting Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., A mystical forest" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Genre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fantasy">Fantasy 🧙</SelectItem>
                          <SelectItem value="sci-fi">Sci-Fi 🚀</SelectItem>
                          <SelectItem value="mystery">Mystery 🕵️</SelectItem>
                          <SelectItem value="adventure">Adventure 🧭</SelectItem>
                          <SelectItem value="comedy">Comedy 😂</SelectItem>
                          <SelectItem value="drama">Drama 🎭</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storyLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Desired Story Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select length" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short">Short (~150 words)</SelectItem>
                          <SelectItem value="medium">Medium (~300 words)</SelectItem>
                          <SelectItem value="long">Long (~500 words)</SelectItem>
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
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Weaving Your Tale...</>
                  ) : (
                    <><Wand2 className="mr-2 h-5 w-5" /> Generate Story</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && !generatedStory && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-semibold text-foreground">The Muse is at Work...</h3>
              <p className="text-muted-foreground mt-2">Please wait while your story is being crafted!</p>
            </div>
          )}

          {generatedStory && (
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl font-semibold">
                    {generatedStory.title}
                  </CardTitle>
                </div>
                 <div className="mt-2 space-x-2">
                    <Badge variant="outline">Genre: {form.getValues("genre")}</Badge>
                    <Badge variant="outline">Length: {form.getValues("storyLength") || 'Short'}</Badge>
                 </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-5 bg-black/30 rounded-lg border border-border/20 text-base leading-relaxed min-h-[200px]">
                  {generatedStory.storyText}
                </div>
              </CardContent>
            </Card>
          )}
          {!isLoading && !generatedStory && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Unleash Your Imagination</h3>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Tell us about your character, the world they live in, and the type of story you want to read. Our AI storyteller will do the rest!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
