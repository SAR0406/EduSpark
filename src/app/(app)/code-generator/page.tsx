
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
import { Code2, Wand2, Lightbulb, Terminal, Loader2, Brain, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateCode } from "@/lib/actions";
import type { GenerateCodeOutput } from "@/lib/actions";
import { Separator } from "@/components/ui/separator";
import { awardAchievement } from "@/lib/achievements";

const programmingLanguages = ["Python", "JavaScript", "Java", "C++", "TypeScript", "Go", "Ruby", "PHP", "Swift", "Kotlin", "SQL", "HTML", "CSS", "Shell"];

const codeGeneratorSchema = z.object({
  language: z.string().min(1, { message: "Please select a programming language." }),
  problemDescription: z.string().min(10, { message: "Problem description must be at least 10 characters." }).max(2000, { message: "Problem description must be 2000 characters or less." }),
});

type CodeGeneratorFormValues = z.infer<typeof codeGeneratorSchema>;

export default function CodeGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GenerateCodeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<CodeGeneratorFormValues>({
    resolver: zodResolver(codeGeneratorSchema),
    defaultValues: {
      language: "",
      problemDescription: "",
    },
  });

  async function onSubmit(values: CodeGeneratorFormValues) {
    setIsLoading(true);
    setGeneratedResult(null);

    const result = await handleGenerateCode({
      language: values.language,
      problemDescription: values.problemDescription,
    });

    if (result.success && result.data) {
      setGeneratedResult(result.data);
      toast({
        title: "Code Generated! 🤖✨",
        description: "The AI has generated your code and an explanation.",
      });
      awardAchievement('codeApprentice', toast);
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Code 😟",
        description: result.error || "Failed to get code from the AI. Please try again.",
      });
    }

    setIsLoading(false);
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard!",
      description: "The generated code has been copied.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-2">
        <Terminal className="h-10 w-10 text-primary text-glow" />
        <div>
          <h1 className="text-3xl font-bold font-heading text-gradient-primary">AI Code Generator & Explainer</h1>
          <p className="text-md text-muted-foreground mt-1">
            Select a language, describe a problem, and let AI generate the code and explain it.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><Wand2 className="text-primary h-6 w-6"/>Describe Your Task</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Programming Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programmingLanguages.map((lang) => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="problemDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">Problem Description / Task</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Write a Python function to find the factorial of a number.'"
                          className="min-h-[150px] resize-y"
                          disabled={isLoading}
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
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
                  ) : (
                    <><Wand2 className="mr-2 h-5 w-5" /> Generate & Explain</>
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
              <h3 className="text-2xl font-semibold text-foreground">AI is Building Your Code...</h3>
              <p className="text-muted-foreground mt-2">This might take a few moments. Please wait!</p>
            </div>
          )}

          {generatedResult && (
            <div className="space-y-8">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <Code2 className="text-primary h-6 w-6"/> Generated Code
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedResult.generatedCode)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 bg-black/50 rounded-lg text-sm overflow-x-auto">
                    <code className={`language-${form.getValues("language").toLowerCase()}`}>{generatedResult.generatedCode}</code>
                  </pre>
                </CardContent>
              </Card>
              <Card className="glass-card">
                 <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Brain className="text-primary h-6 w-6" /> Explanation
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                        {generatedResult.explanation}
                    </div>
                 </CardContent>
              </Card>
            </div>
          )}

          {!isLoading && !generatedResult && (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8">
              <Lightbulb className="mx-auto h-20 w-20 text-primary/50 mb-8" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Unlock Code & Understanding</h3>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Describe your coding task on the left to get a solution and a clear explanation of how it works from our AI assistant.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
