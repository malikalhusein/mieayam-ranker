import { z } from "zod";

/**
 * Input validation schemas for security and data integrity
 */

// Review search and filter validation
export const searchFilterSchema = z.object({
  searchTerm: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  productType: z.enum(["kuah", "goreng", "all"]).optional(),
});

// URL validation (for google maps, images, etc)
export const urlSchema = z.string().url().max(2048);

// Text input sanitization
export const sanitizeText = (text: string): string => {
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

// Number validation helper
export const sanitizeNumber = (value: any, min: number = 0, max: number = 10): number => {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return Math.min(Math.max(num, min), max);
};

// Validate and sanitize review scores
export const scoreSchema = z.number().min(0).max(10);

// Validate price
export const priceSchema = z.number().min(0).max(1000000);
