
'use server';
/**
 * @fileoverview Defines the AI flow for verifying quiz answers.
 * This flow takes a user's quiz answers and uses an AI model to determine
 * correctness and provide explanations, acting as an independent verifier.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const model = 'googleai/gemini-2.0-flash-preview';

/**
 * Zod schema for a single question and its corresponding user answer.
 */
const QuestionAndAnswerSchema = z.object({
    questionText: z.string().describe('The text of the quiz question.'),
    options: z.array(z.string()).length(4).describe('The four answer options provided.'),
    userSelectedOptionIndex: z.number().nullable().describe('The index of the option selected by the user, or null if unanswered.'),
});

/**
 * Zod schema for a single verified question result.
 */
const VerifiedQuestionResultSchema = z.object({
    isUserChoiceCorrect: z.boolean().describe("Whether the user's selected answer was correct."),
    verifiedCorrectAnswerIndex: z.number().int().min(0).max(3).describe('The 0-based index of the correct answer, as verified by the AI.'),
    explanation: z.string().describe('A brief explanation for why the verified answer is correct.'),
});

/**
 * Zod schema for the input to the Verify Quiz Answers flow.
 */
export const VerifyQuizAnswersInputSchema = z.object({
  questionsAndUserAnswers: z.array(QuestionAndAnswerSchema),
});
export type VerifyQuizAnswersInput = z.infer<typeof VerifyQuizAnswersInputSchema>;

/**
 * Zod schema for the output of the Verify Quiz Answers flow.
 */
export const VerifyQuizAnswersOutputSchema = z.object({
  verifiedResults: z.array(VerifiedQuestionResultSchema),
});
export type VerifyQuizAnswersOutput = z.infer<typeof VerifyQuizAnswersOutputSchema>;

const prompt = ai.definePrompt({
    name: 'verifyQuizAnswersPrompt',
    input: { schema: VerifyQuizAnswersInputSchema },
    output: { schema: VerifyQuizAnswersOutputSchema },
    system: `You are an AI that verifies quiz answers. Your task is to independently determine the correct answer for each question and compare it to the user's selection.`,
    prompt: `I am a student who just took a quiz. Please verify my answers and provide the correct answer index and a brief explanation for each question, regardless of whether my answer was right or wrong.
        
        Here is the quiz data:
        {{jsonStringify questionsAndUserAnswers}}
        
        For each item, determine if the user's choice was correct, and provide the 'verifiedCorrectAnswerIndex' and a brief 'explanation' for the correct answer.`,
});

const verifyQuizAnswersFlow = ai.defineFlow(
  {
    name: 'verifyQuizAnswersFlow',
    inputSchema: VerifyQuizAnswersInputSchema,
    outputSchema: VerifyQuizAnswersOutputSchema,
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
 * Executes the Verify Quiz Answers flow.
 * @param {VerifyQuizAnswersInput} input - The user's questions and answers.
 * @returns {Promise<VerifyQuizAnswersOutput>} The AI-verified results and explanations.
 */
export async function verifyQuizAnswers(input: VerifyQuizAnswersInput): Promise<VerifyQuizAnswersOutput> {
  return verifyQuizAnswersFlow(input);
}
