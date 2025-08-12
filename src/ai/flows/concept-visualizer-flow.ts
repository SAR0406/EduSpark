
'use server';
/**
 * @fileoverview Defines the AI flow for visualizing concepts by generating images.
 * This flow takes a text description and returns a generated image as a data URI.
 */

import {ai, imageModel} from '@/ai/genkit';
import {z} from 'zod';

/**
 * Zod schema for the input to the Concept Visualizer flow.
 */
export const VisualizeConceptInputSchema = z.object({
  conceptDescription: z.string().describe('A description of the concept to be visualized.'),
});
export type VisualizeConceptInput = z.infer<typeof VisualizeConceptInputSchema>;

/**
 * Zod schema for the output of the Concept Visualizer flow.
 */
export const VisualizeConceptOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  textFeedback: z.string().describe('A short text response to accompany the image.'),
});
export type VisualizeConceptOutput = z.infer<typeof VisualizeConceptOutputSchema>;

/**
 * Executes the Concept Visualizer flow.
 * @param {VisualizeConceptInput} input - The concept to visualize.
 * @returns {Promise<VisualizeConceptOutput>} The generated image data and feedback.
 */
export async function visualizeConcept(input: VisualizeConceptInput): Promise<VisualizeConceptOutput> {
  try {
      const {media} = await ai.generate({
          model: imageModel,
          prompt: `A simple, clear, 2D educational diagram illustrating the concept of: "${input.conceptDescription}". The style should be clean, with clear labels, suitable for a textbook or presentation.`,
          config: {
              responseModalities: ['TEXT', 'IMAGE'],
          },
      });
      
      if (!media?.url) {
          throw new Error("Image generation failed to return a valid image.");
      }

      return {
          imageDataUri: media.url,
          textFeedback: "Here is a visual representation of your concept."
      };
  } catch (error) {
      console.error("Concept visualizer error:", error);
      return {
          imageDataUri: `https://placehold.co/1024x576.png`,
          textFeedback: "AI image generation is currently unavailable. Here is a placeholder image."
      };
  }
}
