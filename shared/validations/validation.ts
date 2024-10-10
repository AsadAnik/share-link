import { z } from 'zod';
import { createNumberSchema, createStringSchema } from './messages.validation';
import { IUnsafeObject } from '@/shared/types';
import { ValidationError } from './error.validation';


/**
 * Validate Profile Update Request
 * @param payload 
 */
// region Profile Update
export function validateProfileUpdateRequest(payload: IUnsafeObject) {
    try {
        const schema = z.object({
            displayName: createStringSchema('displayName', 3, 100),
        });
        schema.parse(payload);
    } catch (error) {
        throw new ValidationError(error as z.ZodError, 'Update profile!');
    }
}


/**
 * Validation Password/Username Update Request
 * @param payload 
 */
// region Password/Username Update
export function validateUsernamePasswordUpdate(payload: IUnsafeObject) {
    try {
        const schema = z
            .object({
                newUsername: createStringSchema('newUsername', 3, 100).optional(),
                newPassword: createStringSchema('newPassword', 6, 100).optional(),
            })
            .refine((data) => data.newUsername || data.newPassword, {
                message: 'Either New Username or New Password must be provided',
                path: ['newUsername', 'newPassword'],
            });

        schema.parse(payload);
    } catch (error) {
        throw new ValidationError(error as z.ZodError, 'Username/Password');
    }
}
