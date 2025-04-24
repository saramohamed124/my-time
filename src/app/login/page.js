"use client"; // if using app directory

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../firebase/firebase'; // adjust path if needed
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("User info:", result.user);

      // Get the ID Token from Firebase Authentication
      const idToken = await result.user.getIdToken();

      // Send the ID token to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data.message === 'User created successfully' || data.message === 'User already exists') {
        // You can perform additional actions like storing user data in context, etc.
      }
    } catch (error) {
      setError('فشل تسجيل الدخول');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">تسجيل الدخول باستخدام Google</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
      >
        تسجيل الدخول
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {user && (
        <div className="mt-6 text-center">
          <p>مرحبًا، {user.displayName}</p>
          <img src={user.photoURL} alt="User Avatar" className="w-16 h-16 rounded-full mt-2" />
        </div>
      )}
    </div>
  );
}
