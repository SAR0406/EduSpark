
'use server';
/**
 * @fileoverview Defines the AI flow for recommending learning content.
 * This flow suggests new topics based on a user's learning history and preferences.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const model = 'googleai/gemini-2.0-flash-preview';

/**
 * Zod schema for the input to the Content Recommendation flow.
 */
export const RecommendContentInputSchema = z.object({
  learningHistory: z.string().describe("A summary of the user's past learning activities and performance."),
  preferences: z.string().describe("A summary of the user's interests and learning style preferences."),
});
export type RecommendContentInput = z.infer<typeof RecommendContentInputSchema>;

/**
 * Zod schema for the output of the Content Recommendation flow.
 */
export const RecommendContentOutputSchema = z.object({
  recommendedMaterials: z.string().describe('A formatted text string containing 3-5 specific topics, concepts, or subjects to explore next.'),
});
export type RecommendContentOutput = z.infer<typeof RecommendContentOutputSchema>;

const prompt = ai.definePrompt({
    name: 'recommendContentPrompt',
    input: { schema: RecommendContentInputSchema },
    output: { schema: RecommendContentOutputSchema },
    system: "You are an AI guidance counselor for academic learning.",
    prompt: `Based on the user's profile, recommend 3-5 specific topics, concepts, or subjects they should explore next.
        Learning History: {{{learningHistory}}}
        Preferences: {{{preferences}}}
        Provide the recommendations as a simple, formatted text response.`,
});


const recommendContentFlow = ai.defineFlow(
  {
    name: 'recommendContentFlow',
    inputSchema: RecommendContentInputSchema,
    outputSchema: RecommendContentOutputSchema,
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
 * Executes the Content Recommendation flow.
 * @param {RecommendContentInput} input - The user's profile information.
 * @returns {Promise<RecommendContentOutput>} The AI-generated recommendations.
 */
export async function recommendContent(input: RecommendContentInput): Promise<RecommendContentOutput> {
  return recommendContentFlow(input);
}
