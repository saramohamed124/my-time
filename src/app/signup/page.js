'use client';

import { useState } from "react";
import GoogleLoginButton from "./components/GoogleProvider";
import signup from '@/app/assets/imgs/signup.png';
import Image from "next/image";
import Link from "next/link";
import InputField, { errorMessages } from "../utils/InputField"; // Import errorMessages directly
import { useAuth } from "../context/AuthContext";
import { MAIL_REGEX, NAME_REGEX, PWD_REGEX } from "../constants/regex"; // Import regex patterns
import PublicRoute from "../components/PublicRoutes";

export default function SignupForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({}); // New state to manage form errors
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation function
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validate firstName
    if (!form.firstName.trim() || !new RegExp(NAME_REGEX).test(form.firstName.trim())) {
      errors.firstName = errorMessages.firstName;
      isValid = false;
    }

    // Validate lastName
    if (!form.lastName.trim() || !new RegExp(NAME_REGEX).test(form.lastName.trim())) {
      errors.lastName = errorMessages.lastName;
      isValid = false;
    }

    // Validate email
    if (!form.email.trim() || !new RegExp(MAIL_REGEX).test(form.email.trim())) {
      errors.email = errorMessages.email;
      isValid = false;
    }

    // Validate password
    if (!form.password.trim() || !new RegExp(PWD_REGEX).test(form.password.trim())) {
      errors.password = errorMessages.password;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for the specific field as user types
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    const isValid = validateForm();
    if (!isValid) {
      setMessage('الرجاء تصحيح الأخطاء في النموذج قبل المتابعة.');
      return; // Stop submission if there are validation errors
    }

    setLoading(true);
    setMessage(''); // Clear previous messages

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user)
        setMessage('تم إنشاء الحساب بنجاح!');
      } else {
        if (data.message && data.message.toLowerCase().includes('already exists')) {
          setMessage('هذا البريد الإلكتروني مسجل بالفعل، الرجاء تسجيل الدخول أو استخدام بريد آخر.');
        } else {
          setMessage('حدث خطأ أثناء إنشاء الحساب، الرجاء المحاولة مرة أخرى.');
        }
      }
    } catch (err) {
      setMessage('فشل إنشاء حساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
    <article className="container w-full grid grid-cols-1 md:grid-cols-2 justify-center items-center my-0 md:my-10 mx-auto">
      <header className="flex flex-col justify-center items-center md:items-start md:justify-between h-full">
        <section className="flex items-center">
          <img src='/favicon.png' />
          <Link href='/' className='text-[#535FFD] text-2xl font-bold'>وقتي</Link>
        </section>
        <Image className="max-w-full" src={signup} alt="signup" />
      </header>

      <main className="mx-0 p-6 bg-[#1D2159] text-white shadow-lg rounded-none md:rounded space-y-6 mb-0">
        <h2 className="text-2xl font-bold text-center">جاهز تنجز مهامك بسهولة؟</h2>
        <p className="text-sm text-center">أنشئ حسابك الآن وابدأ رحلتك نحو إنتاجية أعلى.</p>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          {/* First Name Field */}
          <InputField
            type="text"
            name="firstName"
            placeholder="الاسم الأول"
            handleChange={handleChange}
            value={form.firstName} // Pass value
            error={formErrors.firstName} // Pass error message
          />

          {/* Last Name Field */}
          <InputField
            type="text"
            name="lastName"
            placeholder="اسم العائلة"
            handleChange={handleChange}
            value={form.lastName} // Pass value
            error={formErrors.lastName} // Pass error message
          />

          {/* Email Field */}
          <InputField
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            handleChange={handleChange}
            value={form.email} // Pass value
            error={formErrors.email} // Pass error message
          />

          {/* Password Field */}
          <InputField
            type="password"
            name="password"
            placeholder="كلمة المرور"
            handleChange={handleChange}
            value={form.password} // Pass value
            error={formErrors.password} // Pass error message
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
          </button>
        </form>

        {/* Error/Success Message */}
        {message && (
          <p className={`text-center text-sm mt-4 ${message.includes('تم') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
        {/* Google Login */}
        <p className="or-auth relative text-center">أو</p>
        <section className="flex items-center justify-center mt-4">
          <GoogleLoginButton />
        </section>

        {/* Footer with Login Link */}
        <footer className="flex justify-center w-full">
          <p>لديك حساب بالفعل؟</p>
          <Link className="text-blue-700 px-1" href='/login'>تسجيل الدخول</Link>
        </footer>
      </main>
    </article>
    </PublicRoute>
  );
}