'use server';

/**
 * @fileOverview Generates an image for a given meal.
 *
 * - generateMealImage - A function that generates an image for a meal.
 * - GenerateMealImageInput - The input type for the generateMealImage function.
 * - GenerateMealImageOutput - The return type for the generateMealImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMealImageInputSchema = z.object({
  mealName: z.string().describe('The name of the meal.'),
});
export type GenerateMealImageInput = z.infer<typeof GenerateMealImageInputSchema>;

const GenerateMealImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateMealImageOutput = z.infer<typeof GenerateMealImageOutputSchema>;

export async function generateMealImage(
  input: GenerateMealImageInput
): Promise<GenerateMealImageOutput> {
  return generateMealImageFlow(input);
}

const generateMealImageFlow = ai.defineFlow(
  {
    name: 'generateMealImageFlow',
    inputSchema: GenerateMealImageInputSchema,
    outputSchema: GenerateMealImageOutputSchema,
  },
  async input => {
    // First attempt with a specific prompt
    try {
      const specificPrompt = `Beautiful food photography of '${input.mealName}'. The dish should look delicious and healthy, presented on a clean plate. Natural lighting.`;
      const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: specificPrompt,
      });
      if (media.url) {
        return {imageUrl: media.url};
      }
    } catch (e) {
       console.warn(`Initial image generation failed for "${input.mealName}", trying a simpler prompt.`);
    }
    
    // Fallback attempt with a simpler prompt
    const simplePrompt = `Healthy food: ${input.mealName}`;
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: simplePrompt,
    });
    
    if (!media.url) {
      throw new Error('Failed to generate image even with a simpler prompt.');
    }

    return {imageUrl: media.url};
  }
);
