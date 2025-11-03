import { z } from 'zod';
import type { generatePersonalizedWorkoutPlan } from '@/ai/flows/generate-personalized-workout-plan';
import type { generatePersonalizedDietPlan } from '@/ai/flows/generate-personalized-diet-plan';
import type { getMotivationalTips } from '@/ai/flows/get-motivational-tips';

// Manually defining schema from AI flow
export const UserProfileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  age: z.number().min(1, 'Age must be a positive number.'),
  gender: z.string().min(1, 'Please select a gender.'),
  height: z.number().min(1, 'Height must be a positive number.'),
  weight: z.number().min(1, 'Weight must be a positive number.'),
  fitnessGoals: z.string().min(1, 'Fitness goals are required.'),
  workoutLocation: z.string(),
  availableEquipment: z.string().min(1, 'Please list available equipment.'),
  experienceLevel: z.string(),
  daysPerWeek: z.number().min(1).max(7),
  workoutType: z.string(),
  dietaryPreferences: z.string(),
  mealCount: z.number().min(1).max(5),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

type WorkoutPlan = Awaited<ReturnType<typeof generatePersonalizedWorkoutPlan>>;
export type DailyWorkout = WorkoutPlan['weeklySchedule'][0];

type DietPlan = Awaited<ReturnType<typeof generatePersonalizedDietPlan>>;
export type DailyDiet = DietPlan['dailyPlans'][0];


export type PlanData = {
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
};

export type MotivationalTipsOutput = Awaited<ReturnType<typeof getMotivationalTips>>;
