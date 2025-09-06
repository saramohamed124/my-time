import React, { useState } from 'react';

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
        case 'تطوير الويب (Web Development)':
            return <Briefcase className="w-12 h-12 text-blue-600 mb-4" />;
        case 'تطوير تطبيقات الموبايل (Mobile App Development)':
            return <Code className="w-12 h-12 text-blue-600 mb-4" />;
        case 'علوم البيانات والذكاء الاصطناعي (Data Science & AI)':
            return <LineChart className="w-12 h-12 text-blue-600 mb-4" />;
        case 'الأمن السيبراني (Cybersecurity)':
            return <UserCheck className="w-12 h-12 text-blue-600 mb-4" />;
        default:
            return <Briefcase className="w-12 h-12 text-blue-600 mb-4" />;
    }
};

const CsSpecialties = ({ spec: careerData,  specName, openSpecializationId, handleToggle}) => {
const csFields = careerData.find(field => field.field === specName);
const csSpecializations = csFields ? csFields.specializations : [];

    return (
        <div className="font-sans text-right bg-slate-50 p-4 sm:p-8" dir="rtl">

                <div className="grid grid-cols-1 gap-8">
                        <div key={careerData.field} className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.01] border border-slate-200">
                            <div className="space-y-8">
                                {csSpecializations.map((spec, specIndex) => {
                                    const specializationId = `${specIndex}`;
                                    return (
                                        <div key={specializationId} className="bg-slate-100 rounded-2xl p-0 border border-slate-300 shadow-md">
                                            <button
                                                onClick={() => handleToggle(specializationId)}
                                                className="w-full flex justify-between items-center p-6 text-xl font-semibold text-slate-800 transition-colors duration-200 hover:bg-slate-200 rounded-2xl focus:outline-none"
                                            >
                                                <span className="flex items-center">
                                                    <Briefcase className="w-5 h-5 ml-2 text-blue-600" />
                                                    {spec.specialization}
                                                </span>
                                                <ChevronDown
                                                    className={`w-6 h-6 transform transition-transform duration-300 ${openSpecializationId === specializationId ? 'rotate-180' : 'rotate-0'}`}
                                                />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openSpecializationId === specializationId ? 'max-h-[1000px]' : 'max-h-0'}`}
                                            >
                                                <div className="p-6 pt-0">
                                                    <p className="text-slate-700 text-sm mb-4 leading-relaxed">{spec.tasks}</p>

                                                    <div className="space-y-4 text-sm text-slate-700">
                                                        {Object.entries(spec.required_skills).map(([key, value]) => {
                                                            if (Array.isArray(value) && value.length > 0) {
                                                                const label = {
                                                                    languages: "اللغات",
                                                                    frameworks: "أُطر العمل",
                                                                    tools: "الأدوات",
                                                                    databases: "قواعد البيانات",
                                                                    networking: "الشبكات",
                                                                    operating_systems: "أنظمة التشغيل"
                                                                }[key];
                                                                return (
                                                                    <div key={key}>
                                                                        <p className="font-bold text-slate-900">{label}:</p>
                                                                        <ul className="list-disc pr-5 mt-1 space-y-1 text-slate-600">
                                                                            {value.map((item, i) => <li key={i}>{item}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                );
                                                            } else if (typeof value === 'string' && value.trim() && key !== '_id') {
                                                                const label = {
                                                                    other_skills: "مهارات أخرى",
                                                                    networking: "الشبكات",
                                                                    operating_systems: "أنظمة التشغيل"
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
                                                            <p className="font-bold text-slate-900 flex items-center mb-2"><Youtube className="w-5 h-5 ml-2 text-red-500" /> مصادر يوتيوب:</p>
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
                                    );
                                })}
                            </div>
                        </div>
                </div>
            </div>
    );
};

export default CsSpecialties;
