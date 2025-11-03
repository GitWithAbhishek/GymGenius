'use server';

/**
 * @fileOverview Generates an image for a given fitness exercise.
 *
 * - generateExerciseImage - A function that generates an image for an exercise.
 * - GenerateExerciseImageInput - The input type for the generateExerciseImage function.
 * - GenerateExerciseImageOutput - The return type for the generateExerciseImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExerciseImageInputSchema = z.object({
  exerciseName: z.string().describe('The name of the fitness exercise.'),
});
export type GenerateExerciseImageInput = z.infer<typeof GenerateExerciseImageInputSchema>;

const GenerateExerciseImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateExerciseImageOutput = z.infer<typeof GenerateExerciseImageOutputSchema>;

export async function generateExerciseImage(
  input: GenerateExerciseImageInput
): Promise<GenerateExerciseImageOutput> {
  return generateExerciseImageFlow(input);
}

const generateExerciseImageFlow = ai.defineFlow(
  {
    name: 'generateExerciseImageFlow',
    inputSchema: GenerateExerciseImageInputSchema,
    outputSchema: GenerateExerciseImageOutputSchema,
  },
  async input => {
    // First attempt with a specific prompt
    try {
      const specificPrompt = `Photorealistic action shot of a person performing the '${input.exerciseName}' exercise. The form should be correct. Setting: modern, well-lit gym.`;
      const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: specificPrompt,
      });
if (media?.url) {
  return { imageUrl: media.url };
}

    } catch (e) {
      console.warn(`Initial image generation failed for "${input.exerciseName}", trying a simpler prompt.`);
    }

    // Fallback attempt with a simpler prompt
    const simplePrompt = `Fitness exercise: ${input.exerciseName}`;
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: simplePrompt,
    });
    
if (!media || !media.url) {
  throw new Error('Failed to generate image even with a simpler prompt.');
}

    
    return {imageUrl: media.url};
  }
);
