import { z } from "zod";

/** Contact form submission. */
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  email: z.string().email("Valid email is required").max(160),
  subject: z.string().min(2, "Subject is required").max(160),
  message: z.string().min(10, "Please write a longer message").max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** Login payload. */
export const loginSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(6).max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Portfolio create/update. */
export const portfolioSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().min(2).max(500),
  imageUrl: z.string().url().max(1000),
  publicId: z.string().max(400).optional().nullable(),
  tags: z.array(z.string().max(40)).max(12).default([]),
  category: z.string().max(80).default("YouTube Thumbnail"),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});
export type PortfolioInput = z.infer<typeof portfolioSchema>;

/** Testimonial create/update. */
export const testimonialSchema = z.object({
  name: z.string().min(2).max(80),
  role: z.string().max(120).default(""),
  avatar: z.string().url().max(1000).optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  review: z.string().min(5).max(600),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

/** Generic JSON content section upsert. */
export const contentSchema = z.object({
  key: z.string().min(1).max(60),
  data: z.record(z.string(), z.any()),
});
export type ContentInput = z.infer<typeof contentSchema>;

/** Bulk content save from the dashboard. */
export const contentBulkSchema = z.object({
  sections: z.record(z.string(), z.any()),
});
