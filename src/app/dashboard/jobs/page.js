'use client';
import React, { useState, useEffect } from 'react';

// Inline SVG Icons for visual flair
const Briefcase = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const Code = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
const UserCheck = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>);
const LineChart = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m18 17-6-6L7-3"/></svg>);
const BookOpen = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const LoaderCircle = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>);
const Youtube = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-youtube"><path d="M22.54 6.42a2.84 2.84 0 0 0-2-2c-.5-.1-1.2-.1-2.4-.1a48.16 48.16 0 0 0-16.2 0c-1.2 0-1.9 0-2.4.1a2.84 2.84 0 0 0-2 2c-.1.5-.1 1.2-.1 2.4s0 1.9.1 2.4a2.84 2.84 0 0 0 2 2c.5.1 1.2.1 2.4.1a48.16 48.16 0 0 0 16.2 0c1.2 0 1.9 0 2.4-.1a2.84 2.84 0 0 0 2-2c.1-.5.1-1.2.1-2.4s0-1.9-.1-2.4z"/><polygon points="9 8 16 12 9 16 9 8"/></svg>);
const ChevronDown = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>);

const getDisciplineIcon = (discipline) => {
  switch(discipline.split(' ')[0]) {
    case 'المحاسبة':
      return <LineChart className="w-12 h-12 text-blue-600 mb-4"/>;
    case 'التسويق':
      return <Briefcase className="w-12 h-12 text-blue-600 mb-4"/>;
    case 'الموارد':
      return <UserCheck className="w-12 h-12 text-blue-600 mb-4"/>;
    case 'نظم':
      return <Code className="w-12 h-12 text-blue-600 mb-4"/>;
    default:
      return <Briefcase className="w-12 h-12 text-blue-600 mb-4"/>;
  }
};

const Jobs = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSpecializationId, setOpenSpecializationId] = useState(null);

  const handleToggle = (id) => {
    setOpenSpecializationId(openSpecializationId === id ? null : id);
  };

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL || ''}business-specialties`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('فشل في تحميل البيانات.');
        }
        const data = await response.json();
        setSpecialties(data);
        console.log("Fetched data:", data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("فشل في تحميل البيانات. يرجى التأكد من أن المسار صحيح.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

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

  return (
    <div className="min-h-screen font-sans text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
            دليل التخصصات المهنية
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            اكتشف التخصصات المختلفة، مهامها، المهارات المطلوبة، ومصادر التعلم الموصى بها.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {specialties.map((discipline) => (
            <div key={discipline._id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105 border border-slate-200">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  {getDisciplineIcon(discipline.discipline)}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {discipline.discipline}
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">{discipline.description}</p>
              </div>
              <div className="space-y-8">
                {discipline.specializations.map((spec) => (
                  <div key={spec._id} className="bg-slate-100 rounded-2xl p-0 border border-slate-300 shadow-md">
                    <button
                      onClick={() => handleToggle(spec._id)}
                      className="w-full flex justify-between items-center p-6 text-xl font-semibold text-slate-800 transition-colors duration-200 hover:bg-slate-200 rounded-t-2xl focus:outline-none"
                    >
                      <span className="flex items-center">
                        <Briefcase className="w-5 h-5 ml-2 text-blue-600"/>
                        {spec.specialization}
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 transform transition-transform duration-300 ${openSpecializationId === spec._id ? 'rotate-180' : 'rotate-0'}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-max-h duration-500 ease-in-out ${openSpecializationId === spec._id ? 'max-h-screen' : 'max-h-0'}`}
                    >
                      <div className="p-6 pt-0">
                        <p className="text-slate-700 text-sm mb-4 leading-relaxed">{spec.tasks}</p>

                        <div className="space-y-4 text-sm text-slate-700">
                          {Object.entries(spec.required_skills).map(([key, value]) => {
                            if (Array.isArray(value) && value.length > 0) {
                              const label = {
                                skills: "مهارات أساسية",
                                tools: "أدوات",
                                software: "برامج",
                                methodologies: "منهجيات"
                              }[key];
                              return (
                                <div key={key}>
                                  <p className="font-bold text-slate-900">{label}:</p>
                                  <ul className="list-disc pr-5 mt-1 space-y-1 text-slate-600">
                                    {value.map((item, i) => <li key={i}>{item}</li>)}
                                  </ul>
                                </div>
                              );
                            } else if (typeof value === 'string' && value.trim()) {
                              const label = {
                                principles: "مبادئ",
                                databases: "قواعد البيانات",
                                programming_knowledge: "معرفة برمجية"
                              }[key];
                              return (
                                <div key={key}>
                                  <p className="font-bold text-slate-900">{label}:</p>
                                  <p className="mt-1 text-slate-600">{value}</p>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>

                        {spec.youtube_resources.length > 0 && (
                          <div className="mt-6">
                            <p className="font-bold text-slate-900 flex items-center mb-2"><Youtube className="w-5 h-5 ml-2 text-red-500"/> مصادر يوتيوب:</p>
                            <ul className="list-disc pr-5 space-y-2 text-sm text-slate-600">
                              {spec.youtube_resources.map((res, i) => (
                                <li key={i}>
                                  <span className="font-medium text-blue-600">{res.channel}</span> ({res.language}): {res.content}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
