"use client";
import { useFormik } from "formik";
import * as yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const router = useRouter();

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(4, 'Too short')
      .max(12, 'Too long')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async ({ email, password }) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/jobs');
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert('An unexpected error occurred');
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-2xl text-center font-bold justify-center text-white mb-5">
            Sign in
          </h1>

          <input
            name="email"
            value={formik.values.email}
            className="border-b bg-transparent border-gray-500 focus:outline-none focus:border-white p-2"
            type="email"
            id="email"
            placeholder="Enter your email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm -mb-2">{formik.errors.email}</div>
          )}

          <input
            name="password"
            value={formik.values.password}
            className="border-b bg-transparent border-gray-500 focus:outline-none focus:border-white p-2"
            type="password"
            id="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm -mb-2">{formik.errors.password}</div>
          )}

          <a
            href="#"
            className="text-sm text-right text-gray-400 hover:text-white hover:transition cursor-pointer"
          >
            Forgot password?
          </a>

          <button
            type="submit"
            className="cursor-pointer mt-4 text-white py-2 border border-white hover:bg-white hover:text-black transition"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-400">
            Don&apos;t have an account?{' '}
            <a href="./register" className="text-white hover:underline cursor-pointer">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
