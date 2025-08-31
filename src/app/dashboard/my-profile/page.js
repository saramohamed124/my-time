'use client';

import { MAIL_REGEX, NAME_REGEX } from '@/app/constants/regex';
import { useAuth } from '@/app/context/AuthContext';
import { errorMessages } from '@/app/utils/InputField';
import React, { useState, useEffect } from 'react';

// Icons from Lucide-React
const User = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const Mail = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const Lock = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const ChevronRight = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>);
const LoaderCircle = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>);
const Code = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
const GraduationCap = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M14 10a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2"/><path d="M14 14a2 2 0 0 1-2 2h-2a2 2 0 0 0-2 2v2"/><path d="M2 18v-2a2 2 0 0 1 2-2h2a2 2 0 0 0 2-2v-4a2 2 0 0 1 2-2h2a2 2 0 0 0 2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4"/></svg>);

const Profile = () => {
  const { user } = useAuth();
  const userId = user ? user._id : null;
  const [userData, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
    const [formErrors, setFormErrors] = useState({}); // New state to manage form errors
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty_id: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  // Hardcoded specialties for the dropdown menu
  const specialties = [
    { id: '1', name: "هندسة الميكاترونكس" },
    { id: '2', name: "هندسة الميكانيكا"},
    { id: '3', name: "هندسة طبية" },
    { id: '4', name: "الهندسة المعمارية" },
    { id: '5', name: "هندسة مدنية" },
    { id: '6', name: "هندسة كيميائية" },
    { id: '7', name: "هندسة كهربائية" },
    { id: '8', name: "علوم الحاسب" },
    { id: '9', name: "التسويق" },
    { id: '10', name: "الموارد البشرية" },
    { id: '11', name: "نظم المعلومات الإدارية"},
    { id: '12', name: "المحاسبة"},
  ];

    // Validation function
    const validateForm = () => {
      let errors = {};
      let isValid = true;
  
      // Validate firstName
      if (!formData.firstName.trim() || !new RegExp(NAME_REGEX).test(formData.firstName.trim())) {
        errors.firstName = errorMessages.firstName;
        isValid = false;
      }
  
      // Validate lastName
      if (!formData.lastName.trim() || !new RegExp(NAME_REGEX).test(formData.lastName.trim())) {
        errors.lastName = errorMessages.lastName;
        isValid = false;
      }
  
      // Validate email
      if (!formData.email.trim() || !new RegExp(MAIL_REGEX).test(formData.email.trim())) {
        errors.email = errorMessages.email;
        isValid = false;
      }
  
      // Validate password
      // if (!formData.password.trim() || !new RegExp(PWD_REGEX).test(formData.password.trim())) {
      //   errors.password = errorMessages.password;
      //   isValid = false;
      // }
  
      setFormErrors(errors);
      return isValid;
    };
  
  const fetchUser = async (id) => {
    if (!id) return;
    setLoading(true);
    setProfileMessage({ text: '', type: '' });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/${id}`);
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات المستخدم.');
      }
      const data = await response.json();
      setUser(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        specialty_id: data.specialty_id || '',
      });
      setProfileMessage({ text: 'تم تحميل الملف الشخصي بنجاح!', type: 'success' });
    } catch (error) {
      console.error('Fetch error:', error);
      setProfileMessage({ text: `خطأ: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
        const isValid = validateForm();
    if (!isValid) {
      alert('الرجاء تصحيح الأخطاء في النموذج قبل المتابعة.');
      return; // Stop submission if there are validation errors
    }
    setLoading(true);
    setProfileMessage({ text: '', type: '' });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'فشل في تحديث الملف الشخصي.');
      }
      setProfileMessage({ text: 'تم تحديث الملف الشخصي بنجاح!', type: 'success' });
    } catch (error) {
      console.error('Update error:', error);
      setProfileMessage({ text: `خطأ: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordMessage({ text: '', type: '' });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'فشل في تغيير كلمة المرور.');
      }
      setPasswordData({ oldPassword: '', newPassword: '' });
      setPasswordMessage({ text: 'تم تغيير كلمة المرور بنجاح!', type: 'success' });
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordMessage({ text: `خطأ: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen whitespace-nowrap flex flex-col items-center p-4 sm:p-8 transition-colors duration-300`} dir="rtl">
      <div className="w-full max-w-5xl space-y-10">
        {loading && !userData ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center">
              <LoaderCircle className="h-10 w-10 text-blue-500 animate-spin" />
              <p className="mt-4 text-gray-600">جارٍ تحميل الملف الشخصي...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    <User className="w-6 h-6 ml-3 text-blue-500"/> المعلومات الشخصية
                  </h2>
                  <Code className="w-5 h-5 text-gray-600"/>
                </div>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الإسم الأول</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-right"
                    />
                    {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الإسم الأخير</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-right"
                    />
                    {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                  </div>
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="w-4 h-4 ml-2"/> الإيميل
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-right"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <GraduationCap className="w-4 h-4 ml-2"/> التخصص
                    </label>
                    <select
                      name="specialty_id"
                      value={formData.specialty_id}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-right"
                    >
                      <option value="" disabled>اختر تخصص</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {profileMessage.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${profileMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {profileMessage.text}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !userId}
                  >
                    {loading && <LoaderCircle className="w-5 h-5 animate-spin ml-2"/>}
                    <span>تحديث الملف الشخصي</span>
                    <ChevronRight className="w-5 h-5"/>
                  </button>
                </form>
              </div>
            </div>

            {/* Password Change Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    <Lock className="w-6 h-6 ml-3 text-blue-500"/> تغيير كلمة المرور
                  </h2>
                  <Code className="w-5 h-5 text-gray-600"/>
                </div>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الحالية</label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-right"
                    />
                  </div>
                  {passwordMessage.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {passwordMessage.text}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && <LoaderCircle className="w-5 h-5 animate-spin ml-2"/>}
                    <span>تغيير كلمة المرور</span>
                    <ChevronRight className="w-5 h-5"/>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
