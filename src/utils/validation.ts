import { z } from 'zod';

export const onboardFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .regex(/^[A-Za-z]*$/, 'Only alphabetic characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .regex(/^[A-Za-z]*$/, 'Only alphabetic characters'),
  phone: z
    .string()
    .regex(
      /^\+1[0-9]{10}$/,
      'Phone number must be a valid Canadian number, start with +1, and contain 10 digits after the country code.',
    ),
  corporationNumber: z
    .string()
    .length(9, 'Corporation number must be exactly 9 characters'),
});

export type OnboardFormData = z.infer<typeof onboardFormSchema>;
