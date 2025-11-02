'use client';

import { useState } from "react";
import login_icon from '@/app/assets/imgs/login.png';
import Image from "next/image";
import Link from "next/link";
import GoogleLoginButton from "../signup/components/GoogleProvider";
import InputField , { errorMessages } from "../utils/InputField";  // Import the InputField component
import { MAIL_REGEX, PWD_REGEX } from "../constants/regex"; // Import regex patterns
import { useAuth } from "../context/AuthContext";
import PublicRoute from "../components/PublicRoutes";

export default function LoginPage() {
  const { login } = useAuth();

  const [form, setForm] = useState({
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        await login(data.user);
        setMessage('تم تسجيل الدخول بنجاح!');
      } else {
      if (data.message && data.message.toLowerCase().includes('غير موجود') || data.message.toLowerCase().includes('اسم المستخدم أو كلمة المرور')) {
        setMessage( 'اسم المستخدم أو كلمة المرور غير صحيحة.' );
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
    <article className="container w-full grid grid-cols-1 md:grid-cols-2 justify-center h-full items-center my-0 md:my-4 mx-auto">
      <header className="flex flex-col justify-center items-center md:items-start md:justify-between h-full">
        <section className="flex items-center mb-4">
          <img src='/favicon.png' alt="Logo" />
          <Link href='/' className='text-[#535FFD] text-2xl font-bold ml-2'>وقتي</Link>
        </section>
        <Image className="max-w-full" src={login_icon} alt="login" />
      </header>

      <main className="flex flex-col justify-center h-full mx-0 p-6 bg-[#1D2159] text-white shadow-lg rounded-none md:rounded space-y-6 mb-0">
        <h2 className="text-2xl font-bold text-center">جاهز تنجز أهدافك بسهولة؟</h2>
        <p className="text-sm text-center">ابدأ رحلتك نحو إنتاجية أعلى بتسجيل الدخول.</p>
        
        <form onSubmit={handleSubmit} className=" space-y-4">
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {message && (
          <p className={`text-center text-sm mt-4 ${message.includes('تم') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        <p className="or-auth relative text-center">أو</p>

        {/* Google Login Button */}
        <section className="flex items-center justify-center mt-4">
          <GoogleLoginButton />
        </section>

        <footer className="flex justify-center w-full mt-6">
          <p>ليس لديك حساب ؟</p>
          <Link className="text-blue-700 px-1" href='/signup'>إنشاء حساب</Link>
        </footer>
      </main>
    </article>
    </PublicRoute>
  );
}
