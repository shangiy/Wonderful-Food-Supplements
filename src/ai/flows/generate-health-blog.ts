'use server';
/**
 * @fileOverview A Genkit flow for generating draft blog posts or health tips on wellness topics.
 *
 * - generateHealthBlog - A function that handles the generation of a health blog post.
 * - GenerateHealthBlogInput - The input type for the generateHealthBlog function.
 * - GenerateHealthBlogOutput - The return type for the generateHealthBlog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHealthBlogInputSchema = z.object({
  topic: z.string().describe('The wellness topic for the blog post or health tips.'),
  length: z
    .enum(['short', 'medium', 'long'])
    .optional()
    .describe('Desired length of the blog post (e.g., short, medium, long).'),
  tone: z
    .string()
    .optional()
    .describe('Desired tone of the blog post (e.g., informative, friendly, scientific).'),
});
export type GenerateHealthBlogInput = z.infer<typeof GenerateHealthBlogInputSchema>;

const GenerateHealthBlogOutputSchema = z.object({
  title: z.string().describe('The title of the generated blog post or health tips.'),
  content: z.string().describe('The main content of the blog post or health tips.'),
  keywords: z.array(z.string()).describe('A list of relevant keywords for SEO.'),
});
export type GenerateHealthBlogOutput = z.infer<typeof GenerateHealthBlogOutputSchema>;

export async function generateHealthBlog(input: GenerateHealthBlogInput): Promise<GenerateHealthBlogOutput> {
  return generateHealthBlogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHealthBlogPrompt',
  input: {schema: GenerateHealthBlogInputSchema},
  output: {schema: GenerateHealthBlogOutputSchema},
  prompt: `You are an expert health and wellness content writer. Your task is to create a compelling and informative blog post or set of health tips.

Generate a blog post or health tips on the following topic: "{{{topic}}}".

{{#if length}}The content should be {{length}} in length.{{/if}}
{{#if tone}}The tone should be {{tone}}.{{/if}}

Ensure the output is well-structured, easy to read, and provides valuable insights related to the topic.

Return the response in JSON format including a 'title', 'content', and a list of 'keywords' for SEO purposes.`,
});

const generateHealthBlogFlow = ai.defineFlow(
  {
    name: 'generateHealthBlogFlow',
    inputSchema: GenerateHealthBlogInputSchema,
    outputSchema: GenerateHealthBlogOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
