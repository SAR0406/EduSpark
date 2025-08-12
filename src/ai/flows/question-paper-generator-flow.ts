
'use server';
/**
 * @fileoverview Defines the AI flow for generating question papers.
 * This flow creates a structured exam paper based on specified parameters.
 */

import {ai, model} from '@/ai/genkit';
import {z} from 'zod';

/**
 * Zod schema for a single question within a question paper.
 */
const QuestionSchema = z.object({
  questionText: z.string().describe('The full text of the question.'),
  questionType: z.string().describe('The type of question (e.g., "MCQ", "Short Answer", "Long Answer").'),
  marks: z.number().int().describe('The number of marks allocated to this question.'),
  options: z.array(z.string()).optional().describe('For MCQs, an array of possible answers.'),
  correctAnswer: z.string().optional().describe('The correct answer for the question.'),
  answerKeyPoints: z.string().optional().describe('Key points or rubric for grading the answer.'),
});

/**
 * Zod schema for a section within a question paper.
 */
const SectionSchema = z.object({
  sectionName: z.string().describe('The name of the section (e.g., "Section A").'),
  sectionInstructions: z.string().optional().describe('Instructions specific to this section.'),
  questions: z.array(QuestionSchema).describe('An array of questions in this section.'),
});

/**
 * Zod schema for the input to the Question Paper Generator flow.
 */
export const QuestionPaperInputSchema = z.object({
  className: z.string().describe('The class or grade level.'),
  subject: z.string().describe('The academic subject.'),
  examType: z.string().describe('The type of exam (e.g., "Unit Test", "Final Exam").'),
  totalMarks: z.number().int().describe('The total marks for the paper.'),
  duration: z.string().describe('The duration of the exam (e.g., "3 hours").'),
  specificTopics: z.string().optional().describe('A comma-separated list of specific topics to focus on.'),
  sourceMaterialText: z.string().optional().describe('Optional source text to base questions on.'),
});
export type QuestionPaperInput = z.infer<typeof QuestionPaperInputSchema>;

/**
 * Zod schema for the output of the Question Paper Generator flow.
 */
export const QuestionPaperOutputSchema = z.object({
  title: z.string().describe('The title of the question paper.'),
  totalMarks: z.number().int().describe('The total marks for the paper.'),
  duration: z.string().describe('The duration of the exam.'),
  generalInstructions: z.string().describe('General instructions for the entire paper.'),
  sections: z.array(SectionSchema).describe('An array of sections, each containing questions.'),
});
export type QuestionPaperOutput = z.infer<typeof QuestionPaperOutputSchema>;

const generateQuestionPaperPrompt = ai.definePrompt({
    name: 'generateQuestionPaperPrompt',
    input: { schema: QuestionPaperInputSchema },
    output: { schema: QuestionPaperOutputSchema },
    prompt: `Generate a question paper following CBSE patterns based on these specifications:
        Class: {{{className}}}
        Subject: {{{subject}}}
        Exam Type: {{{examType}}}
        Total Marks: {{{totalMarks}}}
        Duration: {{{duration}}}
        {{#if specificTopics}}Specific Topics to focus on: {{{specificTopics}}}{{/if}}
        {{#if sourceMaterialText}}Base questions on this source material if possible:\n---\n{{{sourceMaterialText}}}\n---{{/if}}
        
        The paper should include a title, general instructions, and multiple sections (e.g., Section A: MCQs, Section B: Short Answer). Each question must have assigned marks and a question type. For MCQs, provide options. Also provide the correct answer or key answer points for every question.`,
});

/**
 * Executes the Question Paper Generator flow.
 * @param {QuestionPaperInput} input - The specifications for the question paper.
 * @returns {Promise<QuestionPaperOutput>} The generated question paper.
 */
export async function generateQuestionPaper(input: QuestionPaperInput): Promise<QuestionPaperOutput> {
  const {output} = await generateQuestionPaperPrompt.generate({
      input: input,
      model: model,
  });
  return output!;
}
