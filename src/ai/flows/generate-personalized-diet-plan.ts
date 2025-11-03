'use server';

/**
 * @fileOverview Generates a personalized diet plan based on user preferences and fitness goals.
 *
 * - generatePersonalizedDietPlan - A function that generates a personalized diet plan.
 * - GeneratePersonalizedDietPlanInput - The input type for the generatePersonalizedDietPlan function.
 * - GeneratePersonalizedDietPlanOutput - The return type for the generatePersonalizedDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedDietPlanInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  gender: z.string().describe('The gender of the user.'),
  height: z.number().describe('The height of the user in centimeters.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  dietaryPreferences: z
    .string()
    .describe('The dietary preferences of the user (e.g., vegetarian, vegan, keto).'),
  fitnessGoals: z
    .string()
    .describe('The fitness goals of the user (e.g., weight loss, muscle gain).'),
  mealCount: z
    .number()
    .describe('The number of meals the plan should include (e.g. 3, 4, or 5).'),
});

export type GeneratePersonalizedDietPlanInput = z.infer<
  typeof GeneratePersonalizedDietPlanInputSchema
>;

const MealSchema = z.object({
  name: z.string().describe('The name of the meal (e.g., "Scrambled Eggs with Spinach").'),
  description: z.string().describe('A brief description of the meal and its ingredients.'),
  calories: z.number().describe('Estimated number of calories for the meal.'),
});

const DailyDietSchema = z.object({
  day: z.number().describe('The day number of the diet plan (e.g., 1).'),
  title: z.string().describe('A title for the day (e.g., "High-Protein Focus Day").'),
  meals: z.array(MealSchema).describe('An array of meals for the day.'),
  dailySummary: z.object({
    totalCalories: z.number().describe('Total estimated calories for the day.'),
    notes: z.string().describe('General notes or tips for the day.'),
  }),
});

const GeneratePersonalizedDietPlanOutputSchema = z.object({
  planTitle: z.string().describe("A catchy title for the entire diet plan."),
  dailyPlans: z.array(DailyDietSchema).describe("An array of daily diet plans for the week."),
});

export type GeneratePersonalizedDietPlanOutput = z.infer<
  typeof GeneratePersonalizedDietPlanOutputSchema
>;

export async function generatePersonalizedDietPlan(
  input: GeneratePersonalizedDietPlanInput
): Promise<GeneratePersonalizedDietPlanOutput> {
  return generatePersonalizedDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedDietPlanPrompt',
  input: {schema: GeneratePersonalizedDietPlanInputSchema},
  output: {schema: GeneratePersonalizedDietPlanOutputSchema},
  prompt: `You are a personal nutritionist. You will generate a personalized diet plan based on the user's details, dietary preferences and fitness goals. The plan should be for a full week (7 days).

User Details:
- Age: {{{age}}}
- Gender: {{{gender}}}
- Height: {{{height}}} cm
- Weight: {{{weight}}} kg

Dietary Preferences: {{{dietaryPreferences}}}
Fitness Goals: {{{fitnessGoals}}}
Number of Meals Per Day: {{{mealCount}}}

Generate a structured 7-day diet plan that aligns with these preferences and goals. The diet plan must include daily breakdowns with specific meals, descriptions, and estimated calories. Ensure the output is in the specified JSON format.`,
});

const generatePersonalizedDietPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedDietPlanFlow',
    inputSchema: GeneratePersonalizedDietPlanInputSchema,
    outputSchema: GeneratePersonalizedDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
