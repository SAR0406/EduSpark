
'use server';
/**
 * @fileoverview Defines the AI Chatbot flow for EduSpark.
 * This flow handles student questions, providing answers based on the
 * learning material provided as context.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const model = 'googleai/gemini-2.0-flash-preview';

/**
 * Zod schema for the input to the AI Chatbot flow.
 */
const AskQuestionInputSchema = z.object({
  question: z.string().describe('The question the student is asking.'),
  learningMaterial: z.string().describe('The learning material to answer the question from.'),
  imageDataUri: z.string().optional().describe("An image provided by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.")
});
export type AskQuestionInput = z.infer<typeof AskQuestionInputSchema>;

/**
 * Zod schema for the output of the AI Chatbot flow.
 */
const AskQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, or a message indicating why the question cannot be answered.'),
});
export type AskQuestionOutput = z.infer<typeof AskQuestionOutputSchema>;


const prompt = ai.definePrompt({
  name: 'askQuestionPrompt',
  input: {schema: AskQuestionInputSchema},
  output: {schema: AskQuestionOutputSchema},
  system: `You are EduSpark AI, a friendly, patient, and knowledgeable AI Tutor. Your primary and ONLY role is to assist with ACADEMIC SUBJECTS AND LEARNING MATERIALS. You must strictly adhere to this role.
- **Strictly Academic Focus**: If the user's question is NOT related to academic subjects, you MUST politely decline. State: "My purpose is to help with academic subjects. I can't assist with requests outside of that scope. Do you have a question about your studies?"
- **Handling Inappropriate User Input**: If the user's question contains abusive language, hate speech, or is otherwise unsafe, you MUST NOT process the harmful part. Instead, respond with: "I cannot respond to requests that contain inappropriate or harmful content. Please keep our conversation respectful and focused on academic topics."
- **Answering Academic Questions**: Provide clear, simple, step-by-step answers. Use formatting like lists or numbered steps. Maintain an encouraging tone with relevant emojis (💡, 🤔, ✅, 🎉, 📚, ✨, 🧑‍🏫, 🎯).
- **Context is Key**: Use the provided 'Learning Material' and any 'Image Context' to formulate your answer. The user has provided the following learning material context:
\`\`\`
{{{learningMaterial}}}
\`\`\``,
  prompt: `
  {{#if imageDataUri}}
    [Image context is provided by the user. Analyze the image in combination with the text.]
    {{media url=imageDataUri}}
  {{/if}}
  
  User Question: {{{question}}}`,
});

const askQuestionFlow = ai.defineFlow(
  {
    name: 'askQuestionFlow',
    inputSchema: AskQuestionInputSchema,
    outputSchema: AskQuestionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt.generate({
      input: input,
      model: model
    });
    return output!;
  }
);

/**
 * Executes the AI Chatbot flow.
 * @param {AskQuestionInput} input - The student's question and context.
 * @returns {Promise<AskQuestionOutput>} The AI-generated answer.
 */
export async function askQuestion(input: AskQuestionInput): Promise<AskQuestionOutput> {
  return askQuestionFlow(input);
}
