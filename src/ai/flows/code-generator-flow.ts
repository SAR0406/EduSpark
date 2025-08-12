
'use server';
/**
 * @fileoverview Defines the AI flow for generating code and explanations.
 * This flow takes a programming language and a problem description and returns
 * the corresponding code and a step-by-step explanation.
 */

import {ai, model} from '@/ai/genkit';
import {z} from 'zod';

/**
 * Zod schema for the input to the Code Generator flow.
 */
const GenerateCodeInputSchema = z.object({
  language: z.string().describe('The programming language for the code generation.'),
  problemDescription: z.string().describe('A detailed description of the problem to solve or the task to perform.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

/**
 * Zod schema for the output of the Code Generator flow.
 */
const GenerateCodeOutputSchema = z.object({
  generatedCode: z.string().describe('The complete, runnable code solution.'),
  explanation: z.string().describe('A detailed, step-by-step explanation of how the code works.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

const generateCodePrompt = ai.definePrompt({
    name: 'generateCodePrompt',
    input: { schema: GenerateCodeInputSchema },
    output: { schema: GenerateCodeOutputSchema },
    prompt: `Generate code and an accompanying explanation for the following request.
        Programming Language: {{{language}}}
        Problem Description: "{{{problemDescription}}}"

        Provide the code as a single string, and a detailed, step-by-step explanation of how the code works.`,
});

/**
 * Executes the Code Generator flow.
 * @param {GenerateCodeInput} input - The language and problem description.
 * @returns {Promise<GenerateCodeOutput>} The generated code and explanation.
 */
export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  const {output} = await generateCodePrompt.generate({
      input: input,
      model: model,
  });
  return output!;
}
