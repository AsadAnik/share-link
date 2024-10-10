import { z } from 'zod';
import {
    TSingUp,
    IValidation,
    IApiResError,
    TSingIn,
    IUnsafeObject,
} from '@/shared/types';
import { createEmailSchema, createStringSchema } from './messages.validation';
import { ValidationError } from './error.validation';

/**
 * SignUp Schema
 */
export const SingUpSchema = z
    .object({
        name: createStringSchema('Name', 3, 50),
        fname: createStringSchema('FName', 3, 50),
        lname: createStringSchema('LName', 3, 50),
        email: createEmailSchema('Email', 100),
        password: createStringSchema('Password', 6, 50),
        confirmPassword: createStringSchema('Confirm Password', 6, 50).optional(),
        verification_code: createStringSchema('Verification code').optional(),
    })
    .superRefine((data: any, ctx: any) => {
        if (data?.confirmPassword && data.password !== data?.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['confirmPassword'],
                message: 'Passwords must match',
            });
        }
    });

/**
 * Validate SignUp Request
 * @param payload 
 * @returns 
 */
export function validateSignupRequest(payload: TSingUp) {
    const validation: IValidation = {
        valid: true,
        error: [],
        format: null,
        message: '',
    };

    try {
        SingUpSchema.parse(payload);

    } catch (error) {
        const errors = error as z.ZodError;
        validation.valid = false;
        validation.format = errors.flatten().fieldErrors;
        validation.error = errors.errors as unknown as IApiResError;
        validation.message = 'SignUp Validation Errors!';
    }

    return validation;
}

/**
 * SignIn Schema
 */
export const SingInSchema = z.object({
    email: createEmailSchema('Email', 100),
    password: createStringSchema('Password', 6, 50),
});

/**
 * Validate SignIn Request
 * @param payload 
 */
export function validateSigninRequest(payload: TSingIn) {
    try {
        SingInSchema.parse(payload);

    } catch (error) {
        throw new ValidationError(error as z.ZodError, 'SignIn validation errors!');
    }
}

/**
 * Validate Forgot Password Request (WILL USE LATER ON IF NEEDED)
 * @param payload 
 */
export function validateForgotPasswordRequest(payload: IUnsafeObject) {
    try {
        const schema = z.object({
            email: createEmailSchema('Email', 100),
        });
        schema.parse(payload);

    } catch (error) {
        throw new ValidationError(
            error as z.ZodError,
            'Forgot password validation errors!',
        );
    }
}

/**
 * Validate Verify Email Request (WILL USE LATER ON IF NEEDED)
 * @param payload 
 */
export function validateVerifyEmailRequest(payload: IUnsafeObject) {
    try {
        const schema = z.object({
            email: createEmailSchema('Email', 100),
            password: createStringSchema('Password', 6, 50),
        });
        schema.parse(payload);

    } catch (error) {
        throw new ValidationError(
            error as z.ZodError,
            'Verify email validation errors!',
        );
    }
}
