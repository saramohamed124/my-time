'use client';

import { useState } from "react";
import { MAIL_REGEX, NAME_REGEX, PWD_REGEX } from "../constants/regex";

const InputField = ({ type, name, placeholder, handleChange: onChange }) => {
  const [error, setError] = useState('');

  // اختار الباترن المناسب حسب نوع الحقل
  let pattern;
  if (name === "firstName" || name === "lastName") {
    pattern = NAME_REGEX;
  } else if (name === "email") {
    pattern = MAIL_REGEX;
  } else if (name === "password") {
    pattern = PWD_REGEX;
  }

  const errorMessages = {
    firstName: "يجب أن يحتوي الاسم الأول على ٤ أحرف على الأقل (عربي أو إنجليزي).",
    lastName: "يجب أن يحتوي اسم العائلة على ٤ أحرف على الأقل (عربي أو إنجليزي).",
    email: "يجب أن يكون البريد الإلكتروني صحيح وينتهي بـ @gmail.com أو .co أو .net.",
    password: "كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص (!@#$%)، وطولها بين ٧ و٢٤ حرف."
  };

  const handleInputChange = (e) => {
    const { value } = e.target;

    if (pattern && !new RegExp(pattern).test(value)) {
      setError(errorMessages[name] || "خطأ في الإدخال.");
    } else {
      setError('');
    }

    onChange(e); // استدعاء دالة التغيير القادمة من فوق
  };

  return (
    <section className="space-y-1">
      <label htmlFor={name} className="block text-sm mb-1">{placeholder}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full border p-2 rounded text-black"
        onChange={handleInputChange}
        required
      />
 {error && (
    <p className="mt-2 p-2 bg-red-100 text-red-600 text-xs font-medium rounded-md">
      {error}
    </p>
  )}    </section>
  );
};

export default InputField;
