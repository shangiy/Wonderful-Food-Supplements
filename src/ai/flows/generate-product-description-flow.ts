'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating product descriptions and health benefits.
 *
 * - generateProductDescription - A function to generate product descriptions and health benefits using AI.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  ingredients: z
    .array(z.string())
    .describe('A list of key ingredients in the product.'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and engaging product description.'),
  healthBenefits: z
    .array(z.string())
    .describe('A list of key health benefits derived from the product.'),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter for a health and nutrition supplement company.
Your task is to create a compelling product description and identify key health benefits based on the provided product name and ingredients.

Product Name: {{{productName}}}
Ingredients: {{#each ingredients}}- {{{this}}}{{/each}}

Generate a detailed product description that highlights its unique selling points and appeals to customers looking for health and wellness solutions. Also, extract and list the primary health benefits associated with the product, based on its ingredients and intended use.
`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateProductDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate product description and benefits.');
    }
    return output;
  }
);
