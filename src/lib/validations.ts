import { z } from 'zod';

export const symptomCheckSchema = z.object({
  symptoms: z
    .string()
    .min(10, 'Please describe your symptoms in more detail')
    .max(1000, 'Too long'),
});

export const appointmentCreateSchema = z.object({
  doctorId: z.string().uuid(),
  scheduledAt: z.string().refine((d) => new Date(d) > new Date(), {
    message: 'Appointment must be in the future',
  }),
  durationMins: z.number().min(15).max(120).optional().default(30),
  notes: z.string().max(500).optional(),
});

export const appointmentUpdateSchema = z.object({
  status: z.enum(['CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
  scheduledAt: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const patientProfileSchema = z.object({
  phone: z.string().max(20).optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().max(5).optional(),
  address: z.string().max(300).optional(),
});

export const doctorProfileSchema = z.object({
  specialisation: z.string().max(100).optional(),
  licenseNumber: z.string().max(50).optional(),
  experienceYears: z.number().min(0).max(60).optional(),
  bio: z.string().max(500).optional(),
  isAvailable: z.boolean().optional(),
});

export const adminCreateUserSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']),
  isActive: z.boolean().optional().default(true),
});

export const adminUpdateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(100).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'No fields to update',
  });
