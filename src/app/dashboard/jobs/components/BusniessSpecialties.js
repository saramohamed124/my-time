import React from 'react'
const Briefcase = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);

const Youtube = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-youtube"><path d="M22.54 6.42a2.84 2.84 0 0 0-2-2c-.5-.1-1.2-.1-2.4-.1a48.16 48.16 0 0 0-16.2 0c-1.2 0-1.9 0-2.4.1a2.84 2.84 0 0 0-2 2c-.1.5-.1 1.2-.1 2.4s0 1.9.1 2.4a2.84 2.84 0 0 0 2 2c.5.1 1.2.1 2.4.1a48.16 48.16 0 0 0 16.2 0c1.2 0 1.9 0 2.4-.1a2.84 2.84 0 0 0 2-2c.1-.5.1-1.2.1-2.4s0-1.9-.1-2.4z"/><polygon points="9 8 16 12 9 16 9 8"/></svg>);

const ChevronDown = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>);

const BusniessSpecialties = ({spec, openSpecializationId, handleToggle}) => {
  return (
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
                                    <p className="font-bold text-slate-900">{label && `${label} : `}</p>
                                    <p className="mt-1 text-slate-600">{label && value}</p>
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
  )
}

export default BusniessSpecialties
