'use client';
import { useAuth } from '@/app/context/AuthContext';
import React, { useState, useEffect } from 'react';
import BusniessSpecialties from './components/BusniessSpecialties';
import CsSpecialties from './components/CsSpecialties';
import EngineeringSpecialties from './components/EngineeringSpecialties';

// Inline SVG Icons for visual flair
const Briefcase = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const Code = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
const UserCheck = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>);
const LineChart = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m18 17-6-6L7-3"/></svg>);
const Youtube = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-youtube"><path d="M22.54 6.42a2.84 2.84 0 0 0-2-2c-.5-.1-1.2-.1-2.4-.1a48.16 48.16 0 0 0-16.2 0c-1.2 0-1.9 0-2.4.1a2.84 2.84 0 0 0-2 2c-.1.5-.1 1.2-.1 2.4s0 1.9.1 2.4a2.84 2.84 0 0 0 2 2c.5.1 1.2.1 2.4.1a48.16 48.16 0 0 0 16.2 0c1.2 0 1.9 0 2.4-.1a2.84 2.84 0 0 0 2-2c.1-.5.1-1.2.1-2.4s0-1.9-.1-2.4z"/><polygon points="9 8 16 12 9 16 9 8"/></svg>);
const ChevronDown = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>);
const LoaderCircle = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>);

const getDisciplineIcon = (discipline) => {
  switch (discipline) {
    case 'المحاسبة':
      return <LineChart className="w-12 h-12 text-blue-600 mb-4"/>;
    case 'التسويق':
      return <Briefcase className="w-12 h-12 text-blue-600 mb-4"/>;
    case 'الموارد البشرية':
      return <UserCheck className="w-12 h-12 text-blue-600 mb-4"/>;
    case 'نظم المعلومات الإدارية':
    case 'علوم الحاسب':
      return <Code className="w-12 h-12 text-blue-600 mb-4"/>;
    default:
      return <Briefcase className="w-12 h-12 text-blue-600 mb-4"/>;
  }
};

const Jobs = () => {
  const { user } = useAuth();
  const specialtyId = user?.specialty_id || null;
  const [specialtyName, setSpecialtyName] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSpecializationId, setOpenSpecializationId] = useState(null);

  const handleToggle = (id) => {
    setOpenSpecializationId(openSpecializationId === id ? null : id);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (!specialtyId) {
        setError("لم يتم تحديد التخصص الخاص بك. الرجاء تحديث ملفك الشخصي.");
        setLoading(false);
        return;
      }
      
      try {
        const specialtyUrl = `${process.env.NEXT_PUBLIC_API_URL}specialties/${specialtyId}`;
        const specialtyResponse = await fetch(specialtyUrl);
        if (!specialtyResponse.ok) throw new Error('فشل في تحميل بيانات التخصص.');
        const specialtyData = await specialtyResponse.json();
        const name = specialtyData.name;
        setSpecialtyName(name);

        let disciplinesUrl = '';
        if (['المحاسبة', 'التسويق', 'الموارد البشرية', 'نظم المعلومات الإدارية'].includes(name)) {
          disciplinesUrl = `${process.env.NEXT_PUBLIC_API_URL}business-specialties`;
        } else if (['علوم الحاسب'].includes(name)) {
          disciplinesUrl = `${process.env.NEXT_PUBLIC_API_URL}cs-specialties`;
        } else {
          disciplinesUrl = `${process.env.NEXT_PUBLIC_API_URL}engineering-specialties`;
        }
        
        const disciplinesResponse = await fetch(disciplinesUrl);
        if (!disciplinesResponse.ok) throw new Error('فشل في تحميل البيانات.');
        const disciplinesData = await disciplinesResponse.json();
        setSpecialties(disciplinesData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("فشل في تحميل البيانات. يرجى التأكد من أن المسار صحيح.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [specialtyId]);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white" dir="rtl">
        <LoaderCircle className="w-16 h-16 text-blue-600 animate-spin"/>
        <p className="mt-4 text-slate-900 font-semibold text-lg">جارٍ تحميل التخصصات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white" dir="rtl">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  const filteredSpecialties = specialtyName === 'علوم الحاسب'
    ? specialties
    : specialties.filter(discipline => discipline.discipline === specialtyName);
  
  return (
    <div className="min-h-screen font-sans text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
            دليل التخصصات المهنية
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            اكتشف التخصصات المختلفة، أهدافها، المهارات المطلوبة، ومصادر التعلم الموصى بها.
          </p>
        </header>
        
        <div className="grid grid-cols-1 gap-8">
          {filteredSpecialties.length > 0 ? (
            filteredSpecialties.map((discipline) => (
              <div key={discipline._id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    {getDisciplineIcon(discipline.discipline)}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {discipline.discipline || discipline.field}
                  </h2>
                  <p className="text-slate-600 text-base leading-relaxed">{discipline.description}</p>
                </div>
                <div className="space-y-8">
                  {(specialtyName.includes('علوم الحاسب'))?(
                      <CsSpecialties key={filteredSpecialties._id} specName={discipline.field} spec={filteredSpecialties} openSpecializationId={openSpecializationId} handleToggle={handleToggle} />
                  ): (specialtyName.includes('هندسة')) ?(
                      discipline.specializations.map((spec) =>
                        <EngineeringSpecialties key={spec._id} spec={spec} openSpecializationId={openSpecializationId} handleToggle={handleToggle} />
                      )
                  ):
                  (
                    discipline.specializations.map((spec) =>
                      <BusniessSpecialties key={spec._id} spec={spec} openSpecializationId={openSpecializationId} handleToggle={handleToggle} />
                  ))}
                </div>
              </div>
            ))
          )
                   : (
            <p className="text-center text-slate-600 text-lg">لم يتم العثور على تخصصات.</p>
          )}
        </div>
        
      </div>
    </div>
  )
};

export default Jobs;