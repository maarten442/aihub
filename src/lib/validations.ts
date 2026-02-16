import { z } from 'zod/v4';

export const createChallengeSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  start_date: z.iso.date(),
  end_date: z.iso.date(),
});

export const createSubmissionSchema = z.object({
  challenge_id: z.uuid(),
  content: z.string().min(1).max(5000),
  file_url: z.string().optional(),
});

export const updateSubmissionSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  feedback: z.string().max(1000).optional(),
});

export const createFrictionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  category: z.string().min(1).max(100),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
});

export const updateFrictionSchema = z.object({
  status: z.enum(['approved', 'rejected', 'resolved']),
  impact_score: z.number().int().min(1).max(10).optional(),
});

export const createLocationSchema = z.object({
  name: z.string().min(1).max(100),
  total_people: z.number().int().min(1),
});

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;
export type CreateFrictionInput = z.infer<typeof createFrictionSchema>;
export type UpdateFrictionInput = z.infer<typeof updateFrictionSchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
