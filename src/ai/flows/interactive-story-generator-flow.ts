
'use server';
/**
 * @fileoverview Defines the AI flow for generating interactive stories.
 * This flow creates a narrative based on user-provided characters, settings, and genres.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const model = 'googleai/gemini-2.0-flash-preview';

/**
 * Zod schema for the input to the Interactive Story Generator flow.
 */
export const GenerateStoryInputSchema = z.object({
  mainCharacter: z.string().describe('The name of the main character.'),
  setting: z.string().describe('The setting or world where the story takes place.'),
  genre: z.enum(['fantasy', 'sci-fi', 'mystery', 'adventure', 'comedy', 'drama']).describe('The genre of the story.'),
  storyLength: z.enum(['short', 'medium', 'long']).optional().describe('The desired length of the story.'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

/**
 * Zod schema for the output of the Interactive Story Generator flow.
 */
export const GenerateStoryOutputSchema = z.object({
  title: z.string().describe('A creative title for the generated story.'),
  storyText: z.string().describe('The full text of the generated story.'),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

const prompt = ai.definePrompt({
    name: 'generateStoryPrompt',
    input: { schema: GenerateStoryInputSchema },
    output: { schema: GenerateStoryOutputSchema },
    prompt: `Write a story with the following elements:
        Main Character: {{{mainCharacter}}}
        Setting: {{{setting}}}
        Genre: {{{genre}}}
        Length: {{{storyLength}}}
        The story should have a clear beginning, middle, and end.
        Also, provide a creative title for the story.`,
});


const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
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
 * Executes the Interactive Story Generator flow.
 * @param {GenerateStoryInput} input - The elements of the story.
 * @returns {Promise<GenerateStoryOutput>} The generated story title and text.
 */
export async function generateInteractiveStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}
