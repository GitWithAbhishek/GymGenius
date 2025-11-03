'use server';

/**
 * @fileOverview Generates a personalized workout plan based on user input.
 *
 * - generatePersonalizedWorkoutPlan - A function that generates a workout plan.
 * - GeneratePersonalizedWorkoutPlanInput - The input type for the generatePersonalizedWorkoutPlan function.
 * - GeneratePersonalizedWorkoutPlanOutput - The return type for the generatePersonalizedWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedWorkoutPlanInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  gender: z.string().describe('The gender of the user.'),
  height: z.number().describe('The height of the user in centimeters.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  fitnessGoals: z.string().describe("The user's fitness goals (e.g., lose weight, build muscle)."),
  workoutLocation: z.string().describe('The workout location (e.g., home, gym).'),
  availableEquipment: z.string().describe('Available equipment for the workout (e.g., dumbbells, resistance bands).'),
  experienceLevel: z.string().describe("The user's experience level (beginner, intermediate, advanced)."),
  daysPerWeek: z.number().describe('How many days per week the user wants to work out.'),
  workoutType: z.string().describe("The user's preferred workout type (e.g. strength training, cardio, HIIT)."),
});

export type GeneratePersonalizedWorkoutPlanInput = z.infer<
  typeof GeneratePersonalizedWorkoutPlanInputSchema
>;

const ExerciseSchema = z.object({
  name: z.string().describe('The name of the exercise.'),
  sets: z.string().describe('The number of sets (e.g., "3").'),
  reps: z.string().describe('The number of repetitions (e.g., "10-12").'),
  rest: z.string().describe('The rest time between sets (e.g., "60s").'),
});

const DailyWorkoutSchema = z.object({
  day: z.number().describe('The day number of the workout plan (e.g., 1).'),
  focus: z.string().describe('The main focus of the day (e.g., "Full Body Strength", "Rest & Recovery").'),
  exercises: z.array(ExerciseSchema).describe('An array of exercises for the day. Can be empty for rest days.'),
});

const GeneratePersonalizedWorkoutPlanOutputSchema = z.object({
  planTitle: z.string().describe("A catchy title for the entire workout plan."),
  weeklySchedule: z.array(DailyWorkoutSchema).describe('A schedule outlining the focus for each day of the week.'),
});


export type GeneratePersonalizedWorkoutPlanOutput = z.infer<
  typeof GeneratePersonalizedWorkoutPlanOutputSchema
>;

export async function generatePersonalizedWorkoutPlan(
  input: GeneratePersonalizedWorkoutPlanInput
): Promise<GeneratePersonalizedWorkoutPlanOutput> {
  return generatePersonalizedWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedWorkoutPlanPrompt',
  input: {schema: GeneratePersonalizedWorkoutPlanInputSchema},
  output: {schema: GeneratePersonalizedWorkoutPlanOutputSchema},
  prompt: `You are an expert fitness trainer who creates personalized workout plans.

  Based on the user's input, generate a structured 7-day workout plan.
  The plan should include a title and a weekly schedule. Each day in the schedule should specify the day number, its focus, and a list of exercises with sets, reps, and rest times.
  Ensure the number of workout days matches the user's 'daysPerWeek' input, filling the other days as "Rest & Recovery" with an empty exercises array.

  User Details:
  - Age: {{{age}}}
  - Gender: {{{gender}}}
  - Height: {{{height}}} cm
  - Weight: {{{weight}}} kg
  
  Fitness Goals: {{{fitnessGoals}}}
  Workout Location: {{{workoutLocation}}}
  Available Equipment: {{{availableEquipment}}}
  Experience Level: {{{experienceLevel}}}
  Days Per Week: {{{daysPerWeek}}}
  Workout Type: {{{workoutType}}}

  The workout plan should be well-structured and easy to follow. Ensure the output is in the specified JSON format.
  `,
});

const generatePersonalizedWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedWorkoutPlanFlow',
    inputSchema: GeneratePersonalizedWorkoutPlanInputSchema,
    outputSchema: GeneratePersonalizedWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
