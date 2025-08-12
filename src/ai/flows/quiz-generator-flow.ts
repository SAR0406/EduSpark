
'use server';
/**
 * @fileoverview Defines the AI flow for generating quizzes.
 * This flow creates a set of multiple-choice questions on a given topic.
 */

import {ai, model} from '@/ai/genkit';
import {z} from 'zod';

/**
 * Zod schema for a single quiz question.
 */
const QuizQuestionSchema = z.object({
  question: z.string().describe('The text of the multiple-choice question.'),
  options: z.array(z.string()).length(4).describe('An array of exactly 4 answer options.'),
  correctAnswerIndex: z.number().int().min(0).max(3).describe('The 0-based index of the correct answer.'),
  explanation: z.string().describe('A brief explanation of why the correct answer is right.'),
});

/**
 * Zod schema for the input to the Quiz Generator flow.
 */
export const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  contextText: z.string().optional().describe('Optional source text to base the quiz on.'),
  numQuestions: z.number().int().min(1).max(10).describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

/**
 * Zod schema for the output of the Quiz Generator flow.
 */
export const GenerateQuizOutputSchema = z.object({
  quizTitle: z.string().describe('A title for the generated quiz.'),
  questions: z.array(QuizQuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

const generateQuizPrompt = ai.definePrompt({
    name: 'generateQuizPrompt',
    input: { schema: GenerateQuizInputSchema },
    output: { schema: GenerateQuizOutputSchema },
    prompt: `Generate a quiz with {{{numQuestions}}} multiple-choice questions on the topic: "{{{topic}}}".
        {{#if contextText}}Use the following context to generate the questions:\n---\n{{{contextText}}}\n---{{/if}}
        
        Each question should have 4 options, a correct answer index (0-3), and a brief explanation for the correct answer. Provide a title for the quiz.`,
});

/**
 * Executes the Quiz Generator flow.
 * @param {GenerateQuizInput} input - The topic, context, and number of questions.
 * @returns {Promise<GenerateQuizOutput>} The generated quiz.
 */
export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  const {output} = await generateQuizPrompt.generate({
      input: input,
      model: model,
  });
  return output!;
}
