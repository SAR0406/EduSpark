
'use server';

import {
  askQuestion,
  type AskQuestionInput,
  type AskQuestionOutput,
} from '@/ai/flows/ai-chatbot';
import {
  generateChapterMaterial,
  type ChapterMaterialInput,
  type ChapterMaterialOutput,
} from '@/ai/flows/chapter-material-generator';
import {
  generateCode,
  type GenerateCodeInput,
  type GenerateCodeOutput,
} from '@/ai/flows/code-generator-flow';
import {
  visualizeConcept,
  type VisualizeConceptInput,
  type VisualizeConceptOutput,
} from '@/ai/flows/concept-visualizer-flow';
import {
  recommendContent,
  type RecommendContentInput,
  type RecommendContentOutput,
} from '@/ai/flows/content-recommendation';
import {
  suggestDebateTopics,
  type SuggestDebateTopicsInput,
  type SuggestDebateTopicsOutput,
} from '@/ai/flows/debate-topic-suggester-flow';
import {
  generateEssay,
  type GenerateEssayInput,
  type GenerateEssayOutput,
} from '@/ai/flows/essay-generator-flow';
import {
  generateFlashcards,
  type GenerateFlashcardsInput,
  type GenerateFlashcardsOutput,
} from '@/ai/flows/flashcard-generator-flow';
import {
  solveMathProblem,
  type HomeworkHelperInput,
  type HomeworkHelperOutput,
} from '@/ai/flows/homework-helper-flow';
import {
  generateInteractiveStory,
  type GenerateStoryInput,
  type GenerateStoryOutput,
} from '@/ai/flows/interactive-story-generator-flow';
import {
  generateStudyPlan,
  type PersonalizedStudyPlanInput,
  type PersonalizedStudyPlanOutput,
} from '@/ai/flows/personalized-study-plans';
import {
  generateQuestionPaper,
  type QuestionPaperInput,
  type QuestionPaperOutput,
} from '@/ai/flows/question-paper-generator-flow';
import {
  generateQuiz,
  type GenerateQuizInput,
  type GenerateQuizOutput as GenkitGenerateQuizOutput,
} from '@/ai/flows/quiz-generator-flow';
import {
  summarizeText,
  type SummarizeTextInput,
  type SummarizeTextOutput,
} from '@/ai/flows/summarizer-flow';
import {
  verifyQuizAnswers,
  type VerifyQuizAnswersInput,
  type VerifyQuizAnswersOutput,
} from '@/ai/flows/verify-quiz-answers-flow';

import { db } from './firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';

// Re-exporting types for client components to use
export type { ChapterMaterialOutput, MCQ } from '@/ai/flows/chapter-material-generator';
export type { GenerateCodeOutput } from '@/ai/flows/code-generator-flow';
export type { VisualizeConceptOutput } from '@/ai/flows/concept-visualizer-flow';
export type { SuggestDebateTopicsOutput } from '@/ai/flows/debate-topic-suggester-flow';
export type { GenerateEssayOutput } from '@/ai/flows/essay-generator-flow';
export type { GenerateFlashcardsOutput } from '@/ai/flows/flashcard-generator-flow';
export type { HomeworkHelperOutput } from '@/ai/flows/homework-helper-flow';
export type { GenerateStoryOutput } from '@/ai/flows/interactive-story-generator-flow';
export type { QuestionPaperOutput } from '@/ai/flows/question-paper-generator-flow';
export type { SummarizeTextOutput } from '@/ai/flows/summarizer-flow';
export type { VerifyQuizAnswersOutput, VerifiedQuestionResult } from '@/ai/flows/verify-quiz-answers-flow';
export type { GenkitGenerateQuizOutput as GenerateQuizOutput };

// Generic Action Result Wrapper
interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic AI Flow Handler
async function handleFlow<TInput, TOutput>(
  flow: (input: TInput) => Promise<TOutput>,
  input: TInput,
  flowName: string
): Promise<ActionResult<TOutput>> {
  try {
    const data = await flow(input);
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error in ${flowName}:`, errorMessage);
    return { success: false, error: `Failed to execute ${flowName.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${errorMessage}` };
  }
}

// AI Action Implementations
export const handleAskQuestion = async (input: AskQuestionInput) => handleFlow(askQuestion, input, "askQuestion");
export const handleGenerateChapterMaterial = async (input: ChapterMaterialInput) => handleFlow(generateChapterMaterial, input, "generateChapterMaterial");
export const handleGenerateCode = async (input: GenerateCodeInput) => handleFlow(generateCode, input, "generateCode");
export const handleVisualizeConcept = async (input: VisualizeConceptInput) => handleFlow(visualizeConcept, input, "visualizeConcept");
export const handleRecommendContent = async (input: RecommendContentInput) => handleFlow(recommendContent, input, "recommendContent");
export const handleSuggestDebateTopics = async (input: SuggestDebateTopicsInput) => handleFlow(suggestDebateTopics, input, "suggestDebateTopics");
export const handleGenerateEssay = async (input: GenerateEssayInput) => handleFlow(generateEssay, input, "generateEssay");
export const handleGenerateFlashcards = async (input: GenerateFlashcardsInput) => handleFlow(generateFlashcards, input, "generateFlashcards");
export const handleSolveMathProblem = async (input: HomeworkHelperInput) => handleFlow(solveMathProblem, input, "solveMathProblem");
export const handleGenerateInteractiveStory = async (input: GenerateStoryInput) => handleFlow(generateInteractiveStory, input, "generateInteractiveStory");
export const handleGenerateStudyPlan = async (input: PersonalizedStudyPlanInput) => handleFlow(generateStudyPlan, input, "generateStudyPlan");
export const handleGenerateQuestionPaper = async (input: QuestionPaperInput) => handleFlow(generateQuestionPaper, input, "generateQuestionPaper");
export const handleGenerateQuiz = async (input: GenerateQuizInput) => handleFlow(generateQuiz, input, "generateQuiz");
export const handleSummarizeText = async (input: SummarizeTextInput) => handleFlow(summarizeText, input, "summarizeText");
export const handleVerifyQuizAnswers = async (input: VerifyQuizAnswersInput) => handleFlow(verifyQuizAnswers, input, "verifyQuizAnswers");

/**
 * Logs a study activity to the user's subcollection in Firestore.
 * @param {string} userId - The UID of the user.
 * @param {{ title: string, subject: string }} activity - The activity details.
 * @returns {Promise<ActionResult<null>>} The result of the action.
 */
export async function logStudyActivity(userId: string, activity: { title: string, subject: string }): Promise<ActionResult<null>> {
    if (!userId) {
        return { success: false, error: "User is not authenticated. Cannot log activity." };
    }
    try {
        const userActivitiesRef = collection(db, 'users', userId, 'studyActivities');
        await addDoc(userActivitiesRef, {
            ...activity,
            timestamp: serverTimestamp()
        });
        return { success: true, data: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Failed to log study activity:', errorMessage);
        return { success: false, error: `Failed to log activity: ${errorMessage}` };
    }
}
