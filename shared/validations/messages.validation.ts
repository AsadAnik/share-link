import { z } from 'zod';

export const requiredMessage = (field: string) => `${field} is required`;
export const maxLengthMessage = (field: string, max: number) => `${field} must contain at most ${max} character(s)`;
export const minLengthMessage = (field: string, max: number) => `${field} must contain at least ${max} character(s)`;
export const emailMessage = (field: string = 'Email') => `${field} must be a valid email address`;

/**
 * Create String Schema
 * @param fieldName 
 * @param minLength 
 * @param maxLength 
 * @param isOptional 
 * @returns 
 */
// region String Schema
export const createStringSchema = (
  fieldName: string,
  minLength: number = 0,
  maxLength: number = 0,
  isOptional: boolean = false,
) => {
  if (!isOptional) {
    return z
      .string({ required_error: requiredMessage(fieldName) })
      .trim()
      .min(minLength, { message: minLengthMessage(fieldName, minLength) })
      .max(maxLength, { message: maxLengthMessage(fieldName, maxLength) });
  } else {
    return z
      .string({ required_error: requiredMessage(fieldName) })
      .trim()
      .min(minLength, { message: minLengthMessage(fieldName, minLength) })
      .max(maxLength, { message: maxLengthMessage(fieldName, maxLength) })
      .optional();
  }
};

/**
 * Create Number Schema
 * @param fieldName 
 * @param minLength 
 * @param maxLength 
 * @param isOptional 
 * @returns 
 */
// region Number Schema
export const createNumberSchema = (
  fieldName: string,
  minLength: number = 0,
  maxLength: number = 0,
  isOptional: boolean = false,
) => {
  if (!isOptional) {
    return z
      .number({ required_error: requiredMessage(fieldName) })
      .min(minLength, { message: minLengthMessage(fieldName, minLength) })
      .max(maxLength, { message: maxLengthMessage(fieldName, maxLength) });
  } else {
    return z
      .number({ required_error: requiredMessage(fieldName) })
      .min(minLength, { message: minLengthMessage(fieldName, minLength) })
      .max(maxLength, { message: maxLengthMessage(fieldName, maxLength) })
      .optional();
  }
};

/**
 * Create Email Schema
 * @param fieldName 
 * @param maxLength 
 * @returns 
 */
// region Email Schema
export const createEmailSchema = (fieldName: string, maxLength: number = 0) => {
  const schema = createStringSchema(
    fieldName,
    0,
    maxLength,
    false,
  ) as z.ZodString;
  return schema.email(emailMessage(fieldName));
};
