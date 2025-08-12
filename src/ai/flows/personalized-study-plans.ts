
'use server';
/**
 * @fileoverview Defines the AI flow for generating personalized study plans.
 * This flow creates a tailored study schedule based on user performance and goals.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const model = 'googleai/gemini-2.0-flash-preview';

/**
 * Zod schema for the input to the Personalized Study Plan flow.
 */
export const PersonalizedStudyPlanInputSchema = z.object({
  studentPerformance: z.string().describe("A summary of the student's past performance, strengths, and weaknesses."),
  learningGoals: z.string().describe('The specific academic goals the student wants to achieve.'),
  availableMaterials: z.string().describe('A list of learning materials available to the student (e.g., textbooks, online resources).'),
});
export type PersonalizedStudyPlanInput = z.infer<typeof PersonalizedStudyPlanInputSchema>;

/**
 * Zod schema for the output of the Personalized Study Plan flow.
 */
export const PersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('A well-formatted, actionable study plan text.'),
});
export type PersonalizedStudyPlanOutput = z.infer<typeof PersonalizedStudyPlanOutputSchema>;


const prompt = ai.definePrompt({
    name: 'generateStudyPlanPrompt',
    input: { schema: PersonalizedStudyPlanInputSchema },
    output: { schema: PersonalizedStudyPlanOutputSchema },
    system: "You are an AI academic advisor that creates personalized study plans.",
    prompt: `Create a personalized study plan based on the following information. The plan should be structured, actionable, and spread over a reasonable timeline (e.g., a week).
        Student Performance: {{{studentPerformance}}}
        Learning Goals: {{{learningGoals}}}
        Available Materials: {{{availableMaterials}}}
        Provide the output as a well-formatted text string.`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: PersonalizedStudyPlanInputSchema,
    outputSchema: PersonalizedStudyPlanOutputSchema,
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
 * Executes the Personalized Study Plan flow.
 * @param {PersonalizedStudyPlanInput} input - The user's performance, goals, and materials.
 * @returns {Promise<PersonalizedStudyPlanOutput>} The generated study plan.
 */
export async function generateStudyPlan(input: PersonalizedStudyPlanInput): Promise<PersonalizedStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}
