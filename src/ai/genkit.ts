
/**
 * @fileoverview This file initializes the Genkit AI system with the Google AI plugin.
 * It configures the AI models to be used throughout the application, primarily
 * leveraging the free-tier Gemini models for cost-effective development.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// By default, this will use the GOOGLE_API_KEY from your .env file.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  // Log all errors and warnings to the console.
  logLevel: 'warn',
  // Enable the Genkit developer UI for local development.
  enableDevUI: true,
});

/**
 * The primary generative model used throughout the application.
 * Centralized here for easy configuration and swapping.
 */
export const model = 'googleai/gemini-2.0-flash-preview';

/**
 * The primary image generation model used for visualization tasks.
 */
export const imageModel = 'googleai/gemini-2.0-flash-preview-image-generation';

