'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import advicesData from './dailyTips.json';
// --- Static Data (For UI/Logic only, not for data storage) ---
const TIREDNESS_LEVELS = [
    { level: 'قليل', score: 0, text: 'Little' },
    { level: 'أقل من المتوسط', score: 1, text: 'Below Avg' },
    { level: 'متوسط', score: 2, text: 'Average' },
    { level: 'فوق المتوسط', score: 3, text: 'Above Avg' },
    { level: 'عالي', score: 4, text: 'High' }
];

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/'}`; 

/**
 * الخوارزمية المحسّنة لاقتراح المهام بناءً على مستوى التعب المُقاس (نطاق 0-5).
 * تم تعديل حدود النقاط لتناسب النطاق الفعلي المُرسل من الواجهة.
 * * @param {number} tirednessScore - نقاط التعب المُقاسة (0-5).
 * @param {Array<Object>} allTasks - قائمة بكل المهام المتاحة.
 * @returns {Array<Object>} - قائمة بثلاث مهام مقترحة كحد أقصى.
 */
const getSuggestedTasks = (tirednessScore, allTasks) => {
    // 1. التحقق من صحة المدخلات
    if (!allTasks || allTasks.length === 0) {
        console.log("Error: Task list is empty or invalid.");
        return [];
    }

    const suggestions = [];
    let requiredDifficulty = [];
    let preferredTypes = [];

    // 2. تعريف متطلبات المهام بناءً على مستوى التعب (النطاق المُصحح: 0-5)
    
    // التعب المنخفض: 0 أو 1 (طاقة عالية)
    if (tirednessScore <= 1) { 
        requiredDifficulty = ['hard', 'intermediate'];
        preferredTypes = ['study', 'review'];
        console.log(`Score: ${tirednessScore} -> Low Tiredness (Hard Tasks)`);

    // التعب المتوسط: 2 أو 3 (طاقة متوازنة)
    } else if (tirednessScore <= 3) { 
        requiredDifficulty = ['intermediate', 'easy'];
        preferredTypes = ['soft_skills', 'physical'];
        console.log(`Score: ${tirednessScore} -> Medium Tiredness (Balanced Tasks)`);

    // التعب العالي: 4 أو 5 (إرهاق، بحاجة لراحة)
    } else { 
        requiredDifficulty = ['easy'];
        preferredTypes = ['mental_break', 'physical', 'soft_skills'];
        console.log(`Score: ${tirednessScore} -> High Tiredness (Easy/Break Tasks)`);
    }

    // 3. استراتيجية التصفية (لضمان 3 اقتراحات فريدة)

    // Strategy A: المطابقة القوية - مهام تطابق الصعوبة المطلوبة والنوع المُفضل
    const typeMatches = allTasks.filter(task =>
        requiredDifficulty.includes(task.difficulty_level) &&
        preferredTypes.includes(task.type) &&
        task.status !== 'completed' // لا تقترح المهام المكتملة
    ).slice(0, 2); // نأخذ ما يصل إلى مهمتين

    suggestions.push(...typeMatches);

    // Strategy B: ملء الفراغ - مهام تطابق الصعوبة المطلوبة فقط (للتنويع)
    if (suggestions.length < 3) {
        const difficultyMatches = allTasks.filter(task =>
            requiredDifficulty.includes(task.difficulty_level) &&
            task.status !== 'completed' &&
            // التأكد من عدم تكرار المهام التي تم إضافتها بالفعل
            !suggestions.some(s => s._id && s._id === task._id) 
        ).slice(0, 3 - suggestions.length); // نملأ الأماكن المتبقية
        
        suggestions.push(...difficultyMatches);
    }
    
    // 4. إرجاع 3 اقتراحات نهائية كحد أقصى
    return suggestions.slice(0, 3);
};


// --- Shared Components (RadarChart, TaskCard, MissionsCard) ---

const RadarChart = () => {
    const points = "28,50 40,75 70,80 75,50 70,20 40,25";
    const dataPoints = [
        {x: 75, y: 50, value: 808},
        {x: 70, y: 80, value: 237},
        {x: 40, y: 75, value: 201},
        {x: 28, y: 50, value: 705},
        {x: 40, y: 25, value: 435},
        {x: 70, y: 20, value: 74},
    ];

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-500" role="img" aria-labelledby="chart-title">
            <title id="chart-title">معدل الإنجاز</title>
            <circle cx="50" cy="50" r="45" stroke="#e0e0e0" fill="none" strokeWidth="1"></circle>
            <circle cx="50" cy="50" r="30" stroke="#f0f0f0" fill="none" strokeWidth="1"></circle>
            <line x1="50" y1="50" x2="75" y2="50" stroke="#e0e0e0" strokeWidth="0.5"></line>
            <line x1="50" y1="50" x2="70" y2="80" stroke="#e0e0e0" strokeWidth="0.5"></line>
            <line x1="50" y1="50" x2="40" y2="75" stroke="#e0e0e0" strokeWidth="0.5"></line>
            <line x1="50" y1="50" x2="28" y2="50" stroke="#e0e0e0" strokeWidth="0.5"></line>
            <line x1="50" y1="50" x2="40" y2="25" stroke="#e0e0e0" strokeWidth="0.5"></line>
            <line x1="50" y1="50" x2="70" y2="20" stroke="#e0e0e0" strokeWidth="0.5"></line>
            <polygon points={points} fill="#6366f1" opacity="0.6" stroke="#6366f1" strokeWidth="1.5" />
            {dataPoints.map((p, index) => (
                <g key={index}>
                    <circle cx={p.x} cy={p.y} r="2" fill="white" stroke="#6366f1" strokeWidth="1.5" />
                    <text 
                        x={p.x + (p.x > 50 ? 5 : -5)} 
                        y={p.y + (p.y > 50 ? 5 : -5)} 
                        fontSize="4" 
                        textAnchor={p.x > 50 ? "start" : "end"} 
                        fill="#374151" 
                        fontWeight="bold"
                        className="select-none"
                    >
                        {p.value}
                    </text>
                </g>
            ))}
        </svg>
    );
};

const TaskCard = ({ title, icon, isPlaceholder = false }) => (
    <div className={`p-4 rounded-xl shadow-lg transition-shadow cursor-pointer min-w-[150px] text-center ${isPlaceholder ? 'bg-[#EDE4D5] border-2 border-dashed border-gray-300' : 'bg-[#FFF7EC]'}`}>
        <div className="text-4xl mb-2">{icon || '+'}</div>
        <p className="font-semibold text-gray-800">{title || 'إضافة تاسك'}</p>
    </div>
);

// --- Modal Components for Tiredness Test ---

const TiredTestStep1 = ({ setHeadache, nextStep, closeModal }) => (
    <div className="p-8 bg-white rounded-xl w-full max-w-lg shadow-2xl relative text-center transform transition-all scale-100" dir="rtl">
        <button
            onClick={closeModal}
            className="absolute top-4 left-4 text-gray-500 hover:text-red-500 text-3xl font-light"
            title="إغلاق"
        >
            <div className="w-8 h-8 rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center font-extrabold text-2xl p-0 leading-none">
                &times;
            </div>
        </button>
        <h2 className="text-xl font-bold mb-8 text-gray-800">هل تعاني من الصداع؟</h2>
        
        <div className="flex justify-center gap-10">
            <button
                onClick={() => { setHeadache(false); nextStep(); }}
                className="flex flex-col items-center p-6 rounded-xl transition-all w-full max-w-[150px] bg-white hover:bg-gray-50"
            >
                <span className="text-6xl mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#9395D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 7h8m-8 4h8m-8 4h8" /></svg>
                </span>
                <span className="font-bold text-xl text-gray-700">لا</span>
            </button>

            <button
                onClick={() => { setHeadache(true); nextStep(); }}
                className="flex flex-col items-center p-6 rounded-xl transition-all w-full max-w-[150px] bg-white hover:bg-gray-50"
            >
                <span className="text-6xl mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#FF4D4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-4-7h8m-8-4h8" /></svg>
                </span>
                <span className="font-bold text-xl text-gray-700">نعم</span>
            </button>
        </div>
    </div>
);

const TiredTestStep2 = ({ setTirednessScore, nextStep }) => {
    const [selectedScore, setSelectedScore] = useState(null);

    const renderDots = (score) => {
        const dotsArray = [];
        const numDots = score + 1; 

        for (let i = 0; i < numDots; i++) {
            dotsArray.push({
                // Use fixed dots for better visual consistency
                x: [30, 70, 50, 20, 80][i] || 50,
                y: [50, 50, 30, 70, 70][i] || 50,
                r: 4
            });
        }

        return (
            <svg viewBox="0 0 100 100" className="w-16 h-16 transition-all">
                {dotsArray.map((dot, i) => (
                    <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill="#FF8C00" />
                ))}
            </svg>
        );
    };

    const handleSelect = (score) => {
        setSelectedScore(score);
        setTirednessScore(score);
    }

    return (
        <div className="p-8 bg-white rounded-xl w-full max-w-2xl shadow-2xl relative text-center transform transition-all scale-100" dir="rtl">
            <h2 className="text-xl font-bold mb-8 text-gray-800">هل تشعر بالتعب؟</h2>
            <p className="text-lg font-bold text-gray-700 mb-6">معدل شعورك بالتعب</p>

            <div className="grid grid-cols-5 gap-3 sm:gap-6 px-4">
                {TIREDNESS_LEVELS.map(({ level, score }) => (
                    <button
                        key={score}
                        onClick={() => handleSelect(score)}
                        className={`p-2 sm:p-4 rounded-xl transition-all border-2 flex flex-col items-center text-sm font-medium h-48 ${
                            selectedScore === score
                                ? 'bg-indigo-50 border-indigo-500 shadow-lg text-indigo-700 scale-[1.03]'
                                : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                        <div className="flex justify-center items-center h-2/3">
                            {renderDots(score)} 
                        </div>
                        <span className="mt-2 text-base font-semibold">{level}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={nextStep}
                disabled={selectedScore === null}
                className={`w-full mt-10 py-3 rounded-xl transition-all font-semibold text-lg ${
                    selectedScore !== null
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                متابعة
            </button>
        </div>
    );
};

const TiredTestStep3 = ({ suggestedTasks, restartTest }) => (
    <div className="p-8 bg-white rounded-xl w-full max-w-lg shadow-2xl relative text-center transform transition-all scale-100" dir="rtl">
        <h2 className="text-xl font-bold mb-8 text-gray-800 border-b pb-3">هذه المهام المقترحة لك</h2>
        
        <div className="grid grid-cols-2 gap-4">
            {suggestedTasks.length > 0 ? (
                suggestedTasks.map(task => (
                    // التأكد من أن حقل task._id موجود قبل الاستخدام
                    <div key={task._id || JSON.stringify(task)} className="p-4 bg-[#FFF7EC] rounded-xl shadow-lg flex flex-col items-center">
                        <span className="text-5xl mb-2">{task?.icon || '⭐'}</span>
                        <p className="font-bold text-lg text-gray-800">{task.title}</p>
                    </div>
                ))
            ) : (
                <p className="col-span-2 text-center text-lg text-gray-500">لا توجد مهام مقترحة حاليًا.</p>
            )}
        </div>

        <button
            onClick={restartTest}
            className="w-full mt-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg font-semibold text-lg"
        >
            ابدا من جديد / إغلاق
        </button>
    </div>
);



// 3. Next.js Data Fetching (getStaticProps with ISR)
// This function runs on the server during build and revalidation.
const DashboardView = ({ advice }) => {
    // State for the fetched tasks
    const [allTasks, setAllTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for the Tiredness Test Modal
    const [showModal, setShowModal] = useState(false);
    const [testStep, setTestStep] = useState(1);
    const [headache, setHeadache] = useState(false);
    const [tirednessLevelScore, setTirednessLevelScore] = useState(null);

    // Fetch tasks from the API on component mount

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // MAPPING TO: GET /tasks (Read all tasks)
                const response = await fetch(`${API_BASE_URL}tasks`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                
                const fetchedTasks = data.data || data; 

                if (Array.isArray(fetchedTasks) && fetchedTasks.length > 0) {
                    setAllTasks(fetchedTasks);
                } else {
                    console.warn("API returned no tasks or a non-array. Using fallback tasks.");
                }
            } catch (error) {
                console.error("Could not fetch tasks from API:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [allTasks.length]); 

    // Today's suggested tasks for the main dashboard view (Uses fetched data)
    const todaysTasks = useMemo(() => allTasks.slice(0, 3), [allTasks]);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setTestStep(1); 
        setHeadache(false);
        setTirednessLevelScore(null);
    }, []);

    const startTest = () => {
        setShowModal(true);
        setTestStep(1);
        setHeadache(false);
        setTirednessLevelScore(null);
    };

    const nextStep = () => {
        setTestStep(prev => prev + 1);
    };
    
    const restartTest = () => {
        closeModal();
    }

    // Calculate Final Tiredness Score and Suggested Tasks
    const suggestedTasks = useMemo(() => {
        if (tirednessLevelScore === null) return [];
        
        let finalScore = (tirednessLevelScore || 0); // Start from 0 if null
        
        // Add point for headache
        if (headache) {
            finalScore += 1;
        }
        
        // The final score ranges from 0 (very low fatigue) to 5 (maximum fatigue)
        finalScore = Math.min(finalScore, 5); 
        
        // 🚨 Passes the fetched 'allTasks' to the suggestion logic
        return getSuggestedTasks(finalScore, allTasks);

    }, [tirednessLevelScore, headache, allTasks]);


    // Determine Modal Content based on Test Step
    const ModalContent = useMemo(() => {
        switch (testStep) {
            case 1:
                return <TiredTestStep1 setHeadache={setHeadache} nextStep={nextStep} closeModal={closeModal} />;
            case 2:
                return <TiredTestStep2 setTirednessScore={setTirednessLevelScore} nextStep={nextStep} />;
            case 3:
                return <TiredTestStep3 suggestedTasks={suggestedTasks} restartTest={restartTest} />;
            default:
                return null;
        }
    }, [testStep, suggestedTasks, closeModal]);


    return (
        <div className="text-right">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8">أهلاً، أحمد</h2>

            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                
                <div className="lg:col-span-1 md:col-span-1 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">معدل الإنجاز</h3>
                        <div className="h-44 flex justify-center items-center">
                            <RadarChart />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 align-content-center md:col-span-2 space-y-4">
                    <div className="p-6 bg-[#374151] text-white rounded-xl shadow-lg">
                        <p className="text-sm font-light mb-1 opacity-75">نصيحة يومية</p>
                        <h3 className="text-xl font-bold">{advice.tip_text}</h3>
                    </div>
                    <div 
                        className="p-6 bg-[#FF8C00] text-white rounded-xl shadow-lg cursor-pointer hover:bg-orange-600 transition-colors" 
                        onClick={startTest}
                    >
                        <h3 className="text-xl font-bold mb-2">ما مدى شعورك بالإرهاق؟</h3>
                        <p className="text-sm">ساعدنا في تحديد أولوياتك.</p>
                    </div>
                </div>
                <div className="lg:col-span-1 md:col-span-3 md:text-center space-y-4">
                    <div className="p-6 bg-[#EBE0D2] rounded-xl shadow-lg border border-gray-300">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">أفعل المزيد من الإنجازات</h3>
                        <p className="text-gray-600 text-sm mb-4">مستعد لإنجاز جديد! هيا قم بإضافة المزيد من المهام</p>
                        <a href="/dashboard/tasks" className="py-2 px-6 bg-indigo-500 text-white text-nowrap font-semibold rounded-lg hover:bg-indigo-600 transition-colors shadow-md">
                            تاسك جديد
                        </a>
                    </div>
                </div>
            </section >
                        <div className="mt-10">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">تاسكات اليوم</h3>
                            {isLoading ? (
                                <p className="text-gray-600">جاري تحميل المهام...</p>
                            ) : (
                                <div className="flex flex-wrap gap-4 justify-start">
                                    {todaysTasks.map(task => (
                                        <TaskCard key={task._id} title={task.title} icon={task.icon} />
                                    ))}
                                    <TaskCard title="" icon="" isPlaceholder={true} /> 
                                </div>
                            )}
                        </div>
            {showModal && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4"
                    onClick={(e) => { 
                        // Only close modal if clicking the backdrop AND on the first step
                        if (e.currentTarget === e.target && testStep === 1) closeModal(); 
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape' && testStep === 1) closeModal();
                    }}
                    tabIndex={-1}
                >
                    {ModalContent}
                </div>
            )}
        </div>
    );
};


const Dashboard = () => {
  function getDailyAdvice() {
    const now = new Date();
    
    // Use Day of Year for a better, year-long cycle
    const start = new Date(now.getFullYear(), 0, 0); // Start of the year
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const dailyTips = advicesData;
    if (!dailyTips || dailyTips.length === 0) {
        return { tip_text: "لا توجد نصائح متاحة اليوم.", category: "error" };
    }
    
    // The index cycles through the array based on the day of the year
    const adviceIndex = dayOfYear % dailyTips.length;
    
    return dailyTips[adviceIndex];
}
 const revalidate = 60 * 60 * 24; // 86400 seconds (24 hours)

  const dailyAdvice = getDailyAdvice();
    return (
      <main >
        <DashboardView advice={dailyAdvice} />
      </main>
    );
};

export default Dashboard;
