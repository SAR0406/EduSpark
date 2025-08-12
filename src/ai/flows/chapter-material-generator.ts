
'use server';
/**
 * @fileoverview Defines the AI flow for generating chapter-specific learning materials.
 * This flow creates a summary, practice questions, and MCQs for a given topic.
 */

import {ai, model} from '@/ai/genkit';
import {z} from 'zod';

/**
 * Zod schema for the input to the Chapter Material Generator flow.
 */
const ChapterMaterialInputSchema = z.object({
  className: z.string().describe('The class or grade level (e.g., "10th", "NEET").'),
  subject: z.string().describe('The academic subject (e.g., "Physics").'),
  chapterName: z.string().describe('The name of the chapter or topic.'),
});
export type ChapterMaterialInput = z.infer<typeof ChapterMaterialInputSchema>;

/**
 * Zod schema for the MCQ (Multiple Choice Question) object.
 */
const MCQSchema = z.object({
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).length(4).describe('An array of exactly 4 possible answers.'),
  correctAnswerIndex: z.number().int().min(0).max(3).describe('The 0-based index of the correct answer in the options array.'),
});

/**
 * Zod schema for the output of the Chapter Material Generator flow.
 */
const ChapterMaterialOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the chapter.'),
  questions: z.array(z.string()).describe('A list of 5-7 short answer or descriptive practice questions.'),
  mcqs: z.array(MCQSchema).describe('A list of 5 multiple-choice questions.'),
});
export type ChapterMaterialOutput = z.infer<typeof ChapterMaterialOutputSchema>;

const chapterMaterialPrompt = ai.definePrompt({
    name: 'chapterMaterialPrompt',
    input: { schema: ChapterMaterialInputSchema },
    output: { schema: ChapterMaterialOutputSchema },
    prompt: `Generate educational material for a chapter.
        Class/Exam: {{{className}}}
        Subject: {{{subject}}}
        Chapter: {{{chapterName}}}
        
        Provide a concise summary, 5-7 practice questions (short answer/descriptive), and 5 multiple-choice questions (MCQs) with options and the correct answer index.`,
});

/**
 * Executes the Chapter Material Generator flow.
 * @param {ChapterMaterialInput} input - The specifications for the chapter material.
 * @returns {Promise<ChapterMaterialOutput>} The generated learning materials.
 */
export async function generateChapterMaterial(input: ChapterMaterialInput): Promise<ChapterMaterialOutput> {
  const {output} = await chapterMaterialPrompt.generate({
      input: input,
      model: model,
  });
  return output!;
}
