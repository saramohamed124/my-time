'use client';

import { useState } from "react";
import GoogleLoginButton from "./components/GoogleProvider";
import task from '@/app/assets/imgs/taskauth.png';
import Image from "next/image";

export default function SignupForm() {
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
      const res = await fetch("http://localhost:3050/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || 'Signup complete!');
    } catch (err) {
      setMessage("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container w-full grid grid-cols-1 md:grid-cols-2 justify-center items-center my-0 md:my-4 mx-auto">
      <Image className="max-w-full" src={task} alt="task" />
      <main className="mx-0 p-6 bg-[#1D2159] text-white shadow-lg rounded-none md:rounded mt-10 space-y-6">
        <h2 className="text-2xl font-bold text-center">جاهز تنجز مهامك بسهولة؟</h2>
        <p className="text-sm text-center">أنشئ حسابك الآن وابدأ رحلتك نحو إنتاجية أعلى.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm mb-1">الاسم الأول</label>
            <input
              id="firstName"
              name="firstName"
              placeholder="الاسم الأول"
              className="w-full border p-2 rounded text-black"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm mb-1">اسم العائلة</label>
            <input
              id="lastName"
              name="lastName"
              placeholder="اسم العائلة"
              className="w-full border p-2 rounded text-black"
              onChange={handleChange}
              required
            />
          </div>

          <div>
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
          </div>

          <div>
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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
          </button>
        </form>

        {message && <p className="text-center text-sm text-gray-300">{message}</p>}
        <p className="or-auth relative text-center">أو</p>
        <section className="flex items-center justify-center mt-4">
          <GoogleLoginButton />
        </section>
      </main>
    </div>
  );
}
