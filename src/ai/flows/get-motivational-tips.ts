'use server';
/**
 * @fileOverview AI-powered motivational tip generator.
 *
 * - getMotivationalTips - A function that generates motivational tips and lifestyle advice.
 * - MotivationalTipsInput - The input type for the getMotivationalTips function.
 * - MotivationalTipsOutput - The return type for the getMotivationalTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalTipsInputSchema = z.object({
  topics: z
    .array(z.string())
    .describe("The topics for which motivational tips are requested, e.g., ['fitness', 'diet', 'lifestyle', 'posture']."),
});
export type MotivationalTipsInput = z.infer<typeof MotivationalTipsInputSchema>;

const TipSchema = z.object({
  topic: z.string().describe('The topic of the tip.'),
  tip: z.string().describe('A motivational tip related to the given topic.'),
  advice: z.string().describe('Lifestyle advice related to the given topic.'),
});

const MotivationalTipsOutputSchema = z.object({
  tips: z.array(TipSchema),
});
export type MotivationalTipsOutput = z.infer<typeof MotivationalTipsOutputSchema>;

export async function getMotivationalTips(input: MotivationalTipsInput): Promise<MotivationalTipsOutput> {
  return getMotivationalTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalTipsPrompt',
  input: {schema: MotivationalTipsInputSchema},
  output: {schema: MotivationalTipsOutputSchema},
  prompt: `You are a motivational guru providing tips and advice.

  For each of the following topics, generate one motivational tip and one piece of lifestyle advice.

  Topics:
  {{#each topics}}
  - {{{this}}}
  {{/each}}
  
  Please provide the output in the specified JSON format, with a separate entry for each topic.
  `,
});

const getMotivationalTipsFlow = ai.defineFlow(
  {
    name: 'getMotivationalTipsFlow',
    inputSchema: MotivationalTipsInputSchema,
    outputSchema: MotivationalTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
