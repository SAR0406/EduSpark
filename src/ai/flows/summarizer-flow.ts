
'use server';
/**
 * @fileoverview Defines the AI flow for summarizing text.
 * This flow condenses a given block of text into a summary of a specified length.
 */

import {ai, model} from '@/ai/genkit';
import {z} from 'zod';

/**
 * Zod schema for the input to the Summarizer flow.
 */
export const SummarizeTextInputSchema = z.object({
  chapterName: z.string().optional().describe('The optional name of the chapter or document being summarized.'),
  textToSummarize: z.string().describe('The source text to be summarized.'),
  summaryLength: z.enum(['short', 'medium', 'long']).optional().describe('The desired length of the summary.'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

/**
 * Zod schema for the output of the Summarizer flow.
 */
export const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('The generated summary text.'),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

const summarizeTextPrompt = ai.definePrompt({
    name: 'summarizeTextPrompt',
    input: { schema: SummarizeTextInputSchema },
    output: { schema: SummarizeTextOutputSchema },
    system: "You are an AI that summarizes text concisely.",
    prompt: `Summarize the following text.
        {{#if chapterName}}Chapter Name: {{{chapterName}}}{{/if}}
        Desired Length: {{{summaryLength}}}
        
        Text to Summarize:
        ---
        {{{textToSummarize}}}
        ---`,
});

/**
 * Executes the Summarizer flow.
 * @param {SummarizeTextInput} input - The text, optional chapter name, and desired length.
 * @returns {Promise<SummarizeTextOutput>} The generated summary.
 */
export async function summarizeText(input: SummarizeTextInput): Promise<SummarizeTextOutput> {
  const {output} = await summarizeTextPrompt.generate({
      input: input,
      model: model,
  });
  return output!;
}
