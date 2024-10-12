'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import {
    authLoadingSelector,
    authResultSelector,
    useAppDispatch,
} from '@/store';
import { authSignin } from '@/store/actions';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { validateSigninRequest, ValidationError } from '@/shared/validations';
import { IUnsafeObject, TSingIn } from '@/shared/types';
import { useRouter } from 'next/navigation';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const authResult = useSelector(authResultSelector);
    const authLoading = useSelector(authLoadingSelector);
    const router = useRouter();

    useEffect(() => {
        if (email.trim() !== '' && password.trim() !== '') {
            if (authResult?.error && typeof authResult.error === 'object' && 'message' in authResult.error) {
                toast.error(authResult.error.message as string);
                setEmail('');
                setPassword('');
            }

            if (authResult?.data) {
                router.push('/link');
                setEmail('');
                setPassword('');
            }
        }
    }, [authResult]);

    /**
     * Submit for Login..
     * @param event 
     */
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            validateSigninRequest({ email, password } as TSingIn);
            dispatch(authSignin({ email, password }));

        } catch (error) {
            if (error instanceof ValidationError) {
                toast.error(error?.message, {});
            } else {
                const { message } = error as unknown as IUnsafeObject<any>;
                toast.error(message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg px-10 py-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Login to devLinks</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        disabled={authLoading}
                    >
                        {authLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-purple-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
