'use client';

import { useState } from "react";
import task from '@/app/assets/imgs/taskauth.png';
import Image from "next/image";
import Link from "next/link";
import GoogleLoginButton from "../signup/components/GoogleProvider";

export default function LoginPage() {
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
      setMessage(data.message || 'Login complete!');
    } catch (err) {
        console.log(err);
        
      setMessage('فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
        <article className="container w-full grid grid-cols-1 md:grid-cols-2 justify-center h-full items-center my-0 md:my-4 mx-auto">
          <header className="flex flex-col justify-between h-full">
            <section className="flex items-center">
            <img src='/favicon.png'/>
          <Link href='/' className='text-[#535FFD] text-2xl font-bold'>وقتي</Link>
            </section>
          <Image className="max-w-full" src={task} alt="task" />
          </header>
      <main className="h-full mx-0 p-6 bg-[#1D2159] text-white shadow-lg rounded-none md:rounded  space-y-6 mb-0">
        <h2 className="text-2xl font-bold text-center">جاهز تنجز مهامك بسهولة؟</h2>
        <p className="text-sm text-center">أنشئ حسابك الآن وابدأ رحلتك نحو إنتاجية أعلى.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <section>
            <label htmlFor="email" className="block text-sm mb-1">البريد الإلكتروني</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full border p-2 rounded text-black"
              onChange={handleChange}
              required
            />
          </section>

          <section>
            <label htmlFor="password" className="block text-sm mb-1">كلمة المرور</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="كلمة المرور"
              className="w-full border p-2 rounded text-black"
              onChange={handleChange}
              required
            />
          </section>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
          </button>
        </form>

        {message && <p className="text-center text-sm text-red-600">{message}</p>}
        <p className="or-auth relative text-center">أو</p>
        <section className="flex items-center justify-center mt-4">
          <GoogleLoginButton />
        </section>
        <footer className="flex justify-center w-full">
          <p>ليس لديك حساب ؟</p>
          <Link className="text-blue-700 px-1" href='/signup'>إنشاء حساب</Link>
        </footer>
      </main>
    </article>
  );
}
