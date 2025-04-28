'use client';

import { useState } from "react";
import GoogleLoginButton from "./components/GoogleProvider";
import signup from '@/app/assets/imgs/signup.png';
import Image from "next/image";
import Link from "next/link";
import InputField from "../utils/InputField"; // Assuming you've created InputField component
import { useAuth } from "../context/AuthContext";

export default function SignupForm() {
  const { login } = useAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
          />

          {/* Last Name Field */}
          <InputField
            type="text"
            name="lastName"
            placeholder="اسم العائلة"
            handleChange={handleChange}
          />

          {/* Email Field */}
          <InputField
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            handleChange={handleChange}
          />

          {/* Password Field */}
          <InputField
            type="password"
            name="password"
            placeholder="كلمة المرور"
            handleChange={handleChange}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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
  );
}