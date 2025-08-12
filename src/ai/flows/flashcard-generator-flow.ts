
'use server';
/**
 * @fileoverview Defines the AI flow for generating flashcards from source text.
 * This flow creates a set of questions and answers for studying.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const model = 'googleai/gemini-2.0-flash-preview';

/**
 * Zod schema for a single flashcard.
 */
const FlashcardSchema = z.object({
  question: z.string().describe('The question or term for the front of the flashcard.'),
  answer: z.string().describe('The answer or definition for the back of the flashcard.'),
});

/**
 * Zod schema for the input to the Flashcard Generator flow.
 */
export const GenerateFlashcardsInputSchema = z.object({
  sourceText: z.string().describe('The source text from which to generate flashcards.'),
  numFlashcards: z.number().int().min(3).max(20).describe('The number of flashcards to generate.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

/**
 * Zod schema for the output of the Flashcard Generator flow.
 */
export const GenerateFlashcardsOutputSchema = z.object({
  suggestedTitle: z.string().describe('A suggested title for the flashcard set.'),
  flashcards: z.array(FlashcardSchema).describe('An array of generated flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

const prompt = ai.definePrompt({
    name: 'generateFlashcardsPrompt',
    input: { schema: GenerateFlashcardsInputSchema },
    output: { schema: GenerateFlashcardsOutputSchema },
    prompt: `Generate {{{numFlashcards}}} flashcards from the following text. Each flashcard should have a clear question and a concise answer. Also suggest a title for the flashcard set.
        Source Text:
        ---
        {{{sourceText}}}
        ---`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
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
 * Executes the Flashcard Generator flow.
 * @param {GenerateFlashcardsInput} input - The source text and number of cards.
 * @returns {Promise<GenerateFlashcardsOutput>} The generated flashcards and title.
 */
export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}
