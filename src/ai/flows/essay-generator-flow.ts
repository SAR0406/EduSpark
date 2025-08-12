
'use server';
/**
 * @fileoverview Defines the AI flow for generating essays.
 * This flow crafts an essay based on a topic, length, and writing style.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const model = 'googleai/gemini-2.0-flash-preview';

/**
 * Zod schema for the input to the Essay Generator flow.
 */
export const GenerateEssayInputSchema = z.object({
  topic: z.string().describe('The topic or prompt for the essay.'),
  essayLength: z.enum(['short', 'medium', 'long']).optional().describe('The desired length of the essay.'),
  style: z.enum(['academic', 'persuasive', 'narrative', 'descriptive', 'expository']).optional().describe('The desired writing style.'),
});
export type GenerateEssayInput = z.infer<typeof GenerateEssayInputSchema>;

/**
 * Zod schema for the output of the Essay Generator flow.
 */
export const GenerateEssayOutputSchema = z.object({
  titleSuggestion: z.string().describe('A creative title suggestion for the essay.'),
  essay: z.string().describe('The full text of the generated essay.'),
});
export type GenerateEssayOutput = z.infer<typeof GenerateEssayOutputSchema>;

const prompt = ai.definePrompt({
    name: 'generateEssayPrompt',
    input: { schema: GenerateEssayInputSchema },
    output: { schema: GenerateEssayOutputSchema },
    prompt: `Write an essay on the topic: "{{{topic}}}".
        Desired Length: {{{essayLength}}}
        Writing Style: {{{style}}}
        Also suggest a creative title for the essay.`,
});


const generateEssayFlow = ai.defineFlow(
  {
    name: 'generateEssayFlow',
    inputSchema: GenerateEssayInputSchema,
    outputSchema: GenerateEssayOutputSchema,
  },
  async (input) => {
    const {output} = await prompt.generate({
        input: input,
        model: model,
    });
    return output!;
  }
);

/**
 * Executes the Essay Generator flow.
 * @param {GenerateEssayInput} input - The topic, length, and style specifications.
 * @returns {Promise<GenerateEssayOutput>} The generated essay and title suggestion.
 */
export async function generateEssay(input: GenerateEssayInput): Promise<GenerateEssayOutput> {
  return generateEssayFlow(input);
}
