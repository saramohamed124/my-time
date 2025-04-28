"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/firebase/firebase";
import { Fragment, useState } from "react";

// icon
import google from '@/app/assets/icons/google.svg'
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

export default function GoogleLoginButton() {
    const { login } = useAuth();
  
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);


  const handleGoogleLogin = async () => {
    try{
    const provider = new GoogleAuthProvider();
    
  
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
  
    // Send token to backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken: token })
    });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء تسجيل الدخول.");
      }

      await login(data.user);  }catch(err){
    alert("حدث خطأ في الخادم. حاول لاحقاً");
  }
  };
    return (
    <Fragment>
      <button onClick={handleGoogleLogin} className=" w-full flex justify-center gap-2 font-semibold shadow-2xl bg-white text-black px-6 py-3 rounded">
      المواصلة باستخدام جوجل
        <Image width={30} height={30} src={google} alt='google'/>
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </Fragment>
  );
}
