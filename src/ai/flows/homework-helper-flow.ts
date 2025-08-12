
'use server';
/**
 * @fileoverview Defines the AI flow for solving math problems.
 * This flow provides a step-by-step solution and final answer for a given problem.
 */

import {ai, model} from '@/ai/genkit';
import {z} from 'zod';

/**
 * Zod schema for the input to the Homework Helper flow.
 */
const HomeworkHelperInputSchema = z.object({
  problemStatement: z.string().describe('The math problem to be solved.'),
});
export type HomeworkHelperInput = z.infer<typeof HomeworkHelperInputSchema>;

/**
 * Zod schema for the output of the Homework Helper flow.
 */
const HomeworkHelperOutputSchema = z.object({
  problemType: z.string().describe('The type of math problem (e.g., Algebra, Calculus).'),
  stepByStepSolution: z.string().describe('A detailed, step-by-step explanation of the solution.'),
  finalAnswer: z.string().describe('The final, clear answer to the problem.'),
});
export type HomeworkHelperOutput = z.infer<typeof HomeworkHelperOutputSchema>;

const solveMathProblemPrompt = ai.definePrompt({
    name: 'solveMathProblemPrompt',
    input: { schema: HomeworkHelperInputSchema },
    output: { schema: HomeworkHelperOutputSchema },
    prompt: `Solve the following math problem: "{{{problemStatement}}}".
        Identify the problem type (e.g., Algebra, Calculus).
        Provide a detailed, step-by-step solution.
        State the final answer clearly.`,
});

/**
 * Executes the Homework Helper flow.
 * @param {HomeworkHelperInput} input - The problem statement.
 * @returns {Promise<HomeworkHelperOutput>} The solution, steps, and answer.
 */
export async function solveMathProblem(input: HomeworkHelperInput): Promise<HomeworkHelperOutput> {
  const {output} = await solveMathProblemPrompt.generate({
      input: input,
      model: model,
  });
  return output!;
}
