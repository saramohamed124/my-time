'use client';


  export const errorMessages = {
    firstName: "يجب أن يحتوي الاسم الأول على ٤ أحرف على الأقل (عربي أو إنجليزي).",
    lastName: "يجب أن يحتوي اسم العائلة على ٤ أحرف على الأقل (عربي أو إنجليزي).",
    email: "يجب أن يكون البريد الإلكتروني صحيح وينتهي بـ @gmail.com أو .co أو .net.",
    password: "كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص (!@#$%)، وطولها بين ٧ و٢٤ حرف."
  };

const InputField = ({ type, name, placeholder, handleChange: handleChange, value, error }) => {
  return (
    <section className="space-y-1">
      <label htmlFor={name} className="block text-sm mb-1">{placeholder}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full border p-2 rounded text-black"
        onChange={handleChange}
        value={value}
        required
        />
      {error && (
        <p className="mt-2 p-2 bg-red-100 text-red-600 text-xs font-medium rounded-md">
          {error}
        </p>
      )}
      </section>
  );
};

export default InputField;
