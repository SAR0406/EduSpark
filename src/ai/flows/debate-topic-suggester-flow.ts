
'use server';
/**
 * @fileoverview Defines the AI flow for suggesting debate topics.
 * This flow generates a list of engaging topics for a given subject area.
 */

import {ai, model} from '@/ai/genkit';
import {z} from 'zod';

/**
 * Zod schema for the input to the Debate Topic Suggester flow.
 */
const SuggestDebateTopicsInputSchema = z.object({
  subjectArea: z.string().describe('The subject area for which to generate debate topics.'),
  numTopics: z.number().int().min(2).max(7).describe('The number of debate topics to generate.'),
});
export type SuggestDebateTopicsInput = z.infer<typeof SuggestDebateTopicsInputSchema>;

/**
 * Zod schema for the output of the Debate Topic Suggester flow.
 */
const SuggestDebateTopicsOutputSchema = z.object({
  suggestedTitle: z.string().describe('A creative title for the set of debate topics.'),
  topics: z.array(z.string()).describe('A list of the generated debate topics.'),
});
export type SuggestDebateTopicsOutput = z.infer<typeof SuggestDebateTopicsOutputSchema>;

const suggestDebateTopicsPrompt = ai.definePrompt({
    name: 'suggestDebateTopicsPrompt',
    input: { schema: SuggestDebateTopicsInputSchema },
    output: { schema: SuggestDebateTopicsOutputSchema },
    prompt: `Generate {{{numTopics}}} engaging and thought-provoking debate topics for the subject area: "{{{subjectArea}}}". Also suggest a creative title for this set of topics.`,
});

/**
 * Executes the Debate Topic Suggester flow.
 * @param {SuggestDebateTopicsInput} input - The subject and number of topics.
 * @returns {Promise<SuggestDebateTopicsOutput>} The generated title and topics.
 */
export async function suggestDebateTopics(input: SuggestDebateTopicsInput): Promise<SuggestDebateTopicsOutput> {
  const {output} = await suggestDebateTopicsPrompt.generate({
      input: input,
      model: model,
  });
  return output!;
}
