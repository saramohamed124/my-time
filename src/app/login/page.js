'use client';

import { useState } from "react";
import login_icon from '@/app/assets/imgs/login.png';
import Image from "next/image";
import Link from "next/link";
import GoogleLoginButton from "../signup/components/GoogleProvider";
import InputField from "../utils/InputField";  // Import the InputField component
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({
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
    <article className="container w-full grid grid-cols-1 md:grid-cols-2 justify-center h-full items-center my-0 md:my-4 mx-auto">
      <header className="flex flex-col justify-center items-center md:items-start md:justify-between h-full">
        <section className="flex items-center mb-4">
          <img src='/favicon.png' alt="Logo" />
          <Link href='/' className='text-[#535FFD] text-2xl font-bold ml-2'>وقتي</Link>
        </section>
        <Image className="max-w-full" src={login_icon} alt="login" />
      </header>

      <main className="flex flex-col justify-center h-full mx-0 p-6 bg-[#1D2159] text-white shadow-lg rounded-none md:rounded space-y-6 mb-0">
        <h2 className="text-2xl font-bold text-center">جاهز تنجز مهامك بسهولة؟</h2>
        <p className="text-sm text-center">ابدأ رحلتك نحو إنتاجية أعلى بتسجيل الدخول.</p>
        
        <form onSubmit={handleSubmit} className=" space-y-4">
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
  );
}
