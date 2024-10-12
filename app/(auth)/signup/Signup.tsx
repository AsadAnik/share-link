'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { validateSignupRequest } from '@/shared/validations';
import { IUnsafeObject, TSingUp } from '@/shared/types';
import { authLoadingSelector, authResultSelector, useAppDispatch } from '@/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { authSignup } from '@/store/actions';
import { useRouter } from 'next/navigation';

const Register = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const authResult = useSelector(authResultSelector);
    const authLoading = useSelector(authLoadingSelector);
    const router = useRouter();
    const [formData, setFormData] = useState<IUnsafeObject<any>>({
        valid: true,
        error: authResult?.data ?? {},
        message: authResult?.message ?? null,
    });

    useEffect(() => {
        if (email.trim() !== '' && password.trim() !== '') {
            if (authResult?.error && typeof authResult.error === 'object' && 'message' in authResult.error) {
                toast.error(authResult.error.message as string);
                setEmail('');
                setPassword('');
            }

            if (authResult?.data) {
                router.push('/signin');
                setEmail('');
                setPassword('');
            }
        }
    }, [authResult]);

    /**
     * Handle Submit to Register User
     * @param event 
     * @returns 
     */
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const validation = validateSignupRequest({ email, password, confirmPassword } as TSingUp);

        if (!validation?.valid) {
            setFormData({
                valid: validation.valid,
                error: validation?.format,
                message: validation?.message,
            });

            toast.error(validation?.message, {});
            return;
        }

        dispatch(authSignup({ email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg px-10 py-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Create your devLinks Account</h2>

                <form
                    className={formData.valid ? 'space-y-1' : 'space-y-1'}
                    onSubmit={handleSubmit}
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter your email"
                            onError={formData?.error?.email}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Create a password"
                            onError={formData?.error?.password}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        disabled={authLoading}
                    >
                        {authLoading ? 'Siginin...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-purple-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
