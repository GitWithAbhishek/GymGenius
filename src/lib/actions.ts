'use server';

import { generatePersonalizedWorkoutPlan } from '@/ai/flows/generate-personalized-workout-plan';
import { generatePersonalizedDietPlan } from '@/ai/flows/generate-personalized-diet-plan';
import { getMotivationalTips as getMotivationalTipsFlow, type MotivationalTipsInput } from '@/ai/flows/get-motivational-tips';
import { generateExerciseImage } from '@/ai/flows/generate-exercise-image';
import { generateMealImage } from '@/ai/flows/generate-meal-image';
import { generateAudio as generateAudioFlow } from '@/ai/flows/generate-audio';
import type { UserProfile, PlanData } from './types';

export async function generatePlans(
  input: UserProfile
): Promise<PlanData | { error: string }> {
  try {
    const commonInput = {
      age: input.age,
      gender: input.gender,
      height: input.height,
      weight: input.weight,
      fitnessGoals: input.fitnessGoals,
    };

    const [workoutResult, dietResult] = await Promise.all([
      generatePersonalizedWorkoutPlan({
        ...commonInput,
        workoutLocation: input.workoutLocation,
        availableEquipment: input.availableEquipment,
        experienceLevel: input.experienceLevel,
        daysPerWeek: input.daysPerWeek,
        workoutType: input.workoutType,
      }),
      generatePersonalizedDietPlan({
        ...commonInput,
        dietaryPreferences: input.dietaryPreferences,
        mealCount: input.mealCount
      }),
    ]);

    return {
      workoutPlan: workoutResult,
      dietPlan: dietResult,
    };
  } catch (error) {
    console.error('Error generating plans:', error);
    return { error: 'Failed to generate plans. Please try again.' };
  }
}

export async function getMotivationalTips(input: MotivationalTipsInput) {
  try {
    return await getMotivationalTipsFlow(input);
  } catch (error) {
    console.error('Error getting motivational tips:', error);
    // Return a default structure on error to prevent crashes
    return { tips: [] };
  }
}

export async function generateImage(
  itemName: string,
  itemType: 'exercise' | 'meal'
): Promise<{ imageUrl: string } | { error: string }> {
  try {
    if (itemType === 'exercise') {
      const result = await generateExerciseImage({ exerciseName: itemName });
      return { imageUrl: result.imageUrl };
    } else {
      const result = await generateMealImage({ mealName: itemName });
      return { imageUrl: result.imageUrl };
    }
  } catch (error) {
    console.error(`Error generating image for ${itemName}:`, error);
    return { error: 'Failed to generate image.' };
  }
}

export async function generateAudio(
  text: string
): Promise<{ audioUrl: string } | { error: string }> {
  try {
    const result = await generateAudioFlow({ text });
    return { audioUrl: result.audioUrl };
  } catch (error) {
    console.error(`Error generating audio:`, error);
    return { error: 'Failed to generate audio.' };
  }
}
