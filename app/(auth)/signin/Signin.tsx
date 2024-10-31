
'use client';

import Link from 'next/link';
import { authLoadingSelector, authResultSelector, useAppDispatch } from '@/store';
import { authSignin } from '@/store/actions';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import useForm from '@/hooks/useForm';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

const Login = () => {
    const dispatch = useAppDispatch();
    const authResult = useSelector(authResultSelector);
    const authLoading = useSelector(authLoadingSelector);
    const router = useRouter();

    // State for error messages
    const [loginError, setLoginError] = useState('');

    //region Use the custom useForm hook
    const formik = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: (values) => {
            dispatch(authSignin(values));
        },
    });

    useEffect(() => {
        if (authResult?.error && typeof authResult.error === 'object' && 'message' in authResult.error) {
            setLoginError('The credentials are invalid, provide a correct email and password.');
            toast.error(authResult.error.message as string);
        } else if (authResult?.data) {
            router.push('/link');
        }
    }, [authResult]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg px-10 py-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Login to devLinks</h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter your email"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                        ) : null}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter your password"
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                        ) : null}
                    </div>

                    {/* Show login error message */}
                    {loginError && <p className="text-red-500 text-xs mb-2">{loginError}</p>}

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 ${authLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
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
