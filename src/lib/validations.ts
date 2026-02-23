import { z } from 'zod/v4';

export const createChallengeSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  why_it_matters: z.string().min(10).max(1000).optional(),
  start_date: z.iso.date(),
  end_date: z.iso.date(),
  video_url: z.string().regex(/^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/, 'Must be a valid YouTube URL').optional(),
}).strip();

export const createSubmissionSchema = z.object({
  challenge_id: z.guid(),
  location_id: z.guid(),
  content: z.string().min(1).max(5000),
  file_url: z.string().optional(),
}).strip();

export const updateSubmissionSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  feedback: z.string().max(1000).optional(),
}).strip();

export const createFrictionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  category: z.string().min(1).max(100),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
}).strip();

export const updateFrictionSchema = z.object({
  status: z.enum(['approved', 'rejected', 'resolved']),
  impact_score: z.number().int().min(1).max(10).optional(),
}).strip();

export const createLocationSchema = z.object({
  name: z.string().min(1).max(100),
  total_people: z.number().int().min(1),
}).strip();

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;
export type CreateFrictionInput = z.infer<typeof createFrictionSchema>;
export type UpdateFrictionInput = z.infer<typeof updateFrictionSchema>;
export const useCaseStepSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
});

export const createUseCaseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  tools: z.array(z.string()).min(1).max(10),
  category: z.string().min(1).max(100),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']),
  steps: z.array(useCaseStepSchema).min(1).max(20),
  image_url: z.string().optional(),
}).strip();

export const updateUseCaseSchema = z.object({
  status: z.enum(['approved', 'rejected']).optional(),
  is_featured: z.boolean().optional(),
}).strip();

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type CreateUseCaseInput = z.infer<typeof createUseCaseSchema>;
export type UpdateUseCaseInput = z.infer<typeof updateUseCaseSchema>;
