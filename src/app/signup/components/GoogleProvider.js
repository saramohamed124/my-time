"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/firebase/firebase";
import { Fragment, useState } from "react";

// icon
import google from '@/app/assets/icons/google.svg'
import Image from "next/image";

export default function GoogleLoginButton() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);


  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    
  
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
  
    // Send token to backend
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken: token })
    });
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
