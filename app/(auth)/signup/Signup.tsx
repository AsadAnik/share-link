'use client';
import Link from 'next/link';
import { useAppDispatch } from '@/store';
import { authSignup } from '@/store/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useForm from '@/hooks/useForm';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const SignUp = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false); // Loading state

    const formik = useForm({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true); // Start loading
            try {
                await dispatch(authSignup(values)).unwrap();
                toast.success("Signup successful!");
                router.push('/signin');
            } catch (error: any) {
                toast.error(error?.message || 'Signup failed. Please try again.');
            } finally {
                setLoading(false); // Stop loading
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg px-10 py-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

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
                    <div className="mb-4">
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
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Confirm your password"
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                        disabled={loading} 
                    >
                        {loading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-purple-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
