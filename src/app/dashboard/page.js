'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import advicesData from './dailyTips.json';
import { useAuth } from '../context/AuthContext';

// icons
import study_icon from './assets/icons/study_icon.png';
import physical_icon from './assets/icons/physical_icon.png';
import mental_break_icon from './assets/icons/mental_break_icon.png';
import soft_skills_icon from './assets/icons/soft_skills_icon.png';
import review_icon from './assets/icons/review_icon.png';
import cup_icon from './assets/icons/cup.png'
import Image from 'next/image';

const TaskIconMap = {
    study: study_icon,
    physical: physical_icon,
    mental_break: mental_break_icon,
    soft_skills: soft_skills_icon,
    review: review_icon,
    default: review_icon, // Use review as a fallback or create a generic default icon
};
// --- 1. Tiredness Assessment Questions Configuration ---
// Defines the structure for the tiredness assessment questionnaire.
// Each object represents a question with an ID, the question text (in Arabic),
// and a set of options. Each option has a display text and a numerical 'score'
// which contributes to the final tiredness score.
const TIREDNESS_QUESTIONS = [
    {
        id: 1,
        question: 'ما مدى سهولة تشتت انتباهك أو صعوبة تركيزك حالياً؟', // "How easily distracted or difficult is it for you to concentrate now?"
        options: [
            { text: 'لا أواجه صعوب', score: 0 }, // "No difficulty"
            { text: 'صعوبة بسيطة في التركيز', score: 1 }, // "Slight difficulty concentrating"
            { text: 'أواجه صعوبة متوسطة في العودة للمهمة', score: 2 }, // "Moderate difficulty returning to task"
            { text: 'أجد صعوبة كبيرة في الحفاظ على التركيز', score: 3 }, // "Great difficulty maintaining concentration"
            { text: 'التركيز مستحيل حالياً', score: 4 }, // "Concentration is currently impossible"
        ]
    },
    {
        id: 2,
        question: 'ما هو مستوى الدافع أو الحماس لديك لبدء عمل جديد الآن؟', // "What is your level of motivation or enthusiasm to start a new task now?"
        options: [
            { text: 'حماس ودافع عالي جداً', score: 0 }, // "Very high enthusiasm and motivation"
            { text: 'دافع جيد، لكن أحتاج لجهد للبدء', score: 1 }, // "Good motivation, but requires effort to start"
            { text: 'دافع متوسط/محايد', score: 2 }, // "Moderate/neutral motivation"
            { text: 'دافع منخفض جداً', score: 3 }, // "Very low motivation"
            { text: 'لا يوجد دافع على الإطلاق', score: 4 }, // "No motivation at all"
        ]
    },
    {
        id: 3,
        question: 'كيف تقيّم مستوى الطاقة الجسدية لديك في الوقت الحالي؟', // "How do you rate your current physical energy level?"
        options: [
            { text: 'طاقة عالية ومستعد للتحرك', score: 0 }, // "High energy, ready to move"
            { text: 'طاقة جيدة، أشعر ببعض الثقل', score: 1 }, // "Good energy, feel a bit heavy"
            { text: 'طاقة منخفضة قليلاً وأشعر بالتعب', score: 2 }, // "Slightly low energy, feel tired"
            { text: 'أشعر بالإنهاك الجسدي والرغبة في الاستلقاء', score: 3 }, // "Feel physically exhausted and want to lie down"
            { text: 'إرهاق شديد وعجز عن الحركة', score: 4 }, // "Extreme exhaustion and inability to move"
        ]
    }
];

// --- 2. API Configuration ---
// Sets the base URL for API calls, prioritizing the environment variable
// but defaulting to a local host URL if the variable is not set.
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/'}`;

// --- 3. Core Task Suggestion Function ---

/**
 * Suggests up to 3 tasks based on the user's current tiredness score.
 * It filters and prioritizes tasks based on defined difficulty and type criteria
 * corresponding to different tiredness levels.
 * * @param {number} finalTirednessScore - The total score from the tiredness quiz (e.g., 0-12).
 * @param {Array<Object>} allTasks - The full list of user's tasks.
 * @returns {Array<Object>} - A list of up to 3 suggested tasks.
 */
const getSuggestedTasks = (finalTirednessScore, allTasks) => {
    // Input validation: Check if the task list is valid and not empty.
    if (!allTasks || allTasks.length === 0) {
        console.log("Error: Task list is empty or invalid.");
        return [];
    }

    // Maximum possible tiredness score (4 points/question * 3 questions = 12, but using 13 for safety margin)
    const MAX_SCORE = 13;
    
    // Configuration for mapping tiredness scores to suggested task properties (Difficulty and Type).
    // The comments explain the logic:
    const TIREDNESS_LEVELS_GENERAL = [ 
        { 
            score_max: 2, // Low Tiredness (0-2)
            difficulty: ['hard', 'intermediate'], // Focus on hard work
            types: ['study', 'review', 'soft_skills'] 
        }, 
        { 
            score_max: 6, // Medium Tiredness (3-6)
            difficulty: ['intermediate', 'easy'], // Balanced mix
            types: ['soft_skills', 'physical', 'study','other'] 
        }, 
        { 
            score_max: MAX_SCORE, // High Tiredness (7-13)
            difficulty: ['easy'], // Prioritize rest/easy tasks
            types: ['mental_break', 'physical', 'soft_skills'] 
        } 
    ];
    
    let requiredDifficulty = [];
    let preferredTypes = [];

    // 1. Determine Tiredness Level, Required Difficulty, and Preferred Types
    // Iterate through levels to find the one matching the score.
    for (const level of TIREDNESS_LEVELS_GENERAL) {
        if (finalTirednessScore <= level.score_max) {
            requiredDifficulty = level.difficulty;
            preferredTypes = level.types;
            break; // Stop once the correct level is found
        }
    }
    
    // Filter out tasks that are already completed.
    const activeTasks = allTasks.filter(task => task.status !== 'completed');
    const suggestions = [];
    
    // --- 2. Building the Task Filtering Groups by Priority ---
    
    // A. Group A: Dual Match (Difficulty + Type) - Highest Priority
    // Tasks matching BOTH the required difficulty and a preferred type.
    const groupA = activeTasks.filter(task =>
        requiredDifficulty.includes(task.difficulty_level) &&
        preferredTypes.includes(task.type)
    );
    
    // B. Group B: Type Match Only - To ensure variety of preferred activities
    // Tasks matching the preferred type, excluding those already selected in Group A.
    const groupB = activeTasks.filter(task =>
        preferredTypes.includes(task.type) &&
        !groupA.some(s => s._id === task._id) // Avoid tasks already in Group A
    );

    // C. Group C: Difficulty Match Only - To ensure continued activity at the right exertion level
    // Tasks matching the required difficulty, excluding those already selected in Groups A and B.
    const groupC = activeTasks.filter(task =>
        requiredDifficulty.includes(task.difficulty_level) &&
        !groupA.some(s => s._id === task._id) && // Avoid tasks already in Group A
        !groupB.some(s => s._id === task._id)  // Avoid tasks already in Group B (only unique from A)
    );
    
    // --- 3. Assembling the Suggested Tasks (Max 3) ---
    
    // Add up to 3 tasks from Group A (Best match)
    suggestions.push(...groupA.slice(0, 3));
    
    // Fill remaining slots from Group B (Type match)
    if (suggestions.length < 3) {
        // Filter Group B tasks that are not already in suggestions
        const uniqueGroupB = groupB.filter(task => !suggestions.some(s => s._id === task._id));
        suggestions.push(...uniqueGroupB.slice(0, 3 - suggestions.length));
    }
    
    // Fill remaining slots from Group C (Difficulty match)
    if (suggestions.length < 3) {
        // Filter Group C tasks that are not already in suggestions
        const uniqueGroupC = groupC.filter(task => !suggestions.some(s => s._id === task._id));
        suggestions.push(...uniqueGroupC.slice(0, 3 - suggestions.length));
    }
    
    // Return the final list, ensuring uniqueness and limiting to 3 (redundant check for safety).
    const uniqueSuggestions = Array.from(new Set(suggestions.map(s => s._id)))
        .map(_id => suggestions.find(s => s._id === _id));

    return uniqueSuggestions.slice(0, 3);
};// --- Shared Components (RadarChart, TaskCard, MissionsCard) ---

const TaskCard = ({ title, icon, taskType, isPlaceholder = false }) => {
    const imageSource = TaskIconMap[taskType] || TaskIconMap.default;
    return (
        <div className={`p-4 rounded-xl shadow-lg transition-shadow cursor-pointer min-w-[150px] text-center ${isPlaceholder ? 'bg-white border-2 border-dashed border-gray-300' : 'bg-white'}`}>
                <div className="w-12 h-12 mx-auto mb-2 relative">
                    {/* Assuming the imported 'imageSource' is a Next.js Static Image import */}
                    <Image
                        src={imageSource} 
                        alt={title} 
                        layout="fill" 
                        objectFit="contain" 
                    />
                </div>

            <p className="font-semibold text-gray-800">{title}</p>
        </div>
    );
};
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

const TiredTestStep2 = ({ setTirednessScore, nextStep, closeModal }) => {
    const [selectedScores, setSelectedScores] = useState({});

    // تحديث النتيجة عند اختيار خيار
    const handleSelect = (questionId, score) => {
        setSelectedScores(prev => ({
            ...prev,
            [questionId]: score
        }));
    };

    // التحقق مما إذا تم الإجابة على جميع الأسئلة
    const allAnswered = TIREDNESS_QUESTIONS.every(q => selectedScores.hasOwnProperty(q.id));

    // حساب مجموع النقاط
    const totalScore = useMemo(() => {
        return Object.values(selectedScores).reduce((sum, score) => sum + score, 0);
    }, [selectedScores]);

    const handleNext = () => {
        setTirednessScore(totalScore);
        nextStep();
    }

    return (
        <div className="p-8 bg-white rounded-xl w-full max-w-4xl max-h-[80%] overflow-y-scroll shadow-2xl relative text-center transform transition-all scale-100" dir="rtl">
            <button
                onClick={closeModal}
                className="absolute top-4 left-4 text-gray-500 hover:text-red-500 text-3xl font-light"
                title="إغلاق"
            >
                <div className="w-8 h-8 rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center font-extrabold text-2xl p-0 leading-none">
                    &times;
                </div>
            </button>

            <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-3">2. قيّم مستوى الإرهاق لديك حالياً</h2>
            
            <div className="space-y-8 text-right">
                {TIREDNESS_QUESTIONS.map((q) => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <p className="text-lg font-semibold text-gray-800 mb-4">
                            {q.id}. {q.question}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {q.options.map((option) => (
                                <button
                                    key={option.score}
                                    onClick={() => handleSelect(q.id, option.score)}
                                    className={`p-2 rounded-xl transition-all border-2 text-sm h-full ${
                                        selectedScores[q.id] === option.score
                                            ? 'bg-indigo-100 border-indigo-600 shadow-md font-bold text-indigo-800'
                                            : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={!allAnswered}
                className={`w-full mt-10 py-3 rounded-xl transition-all font-semibold text-lg ${
                    allAnswered
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                عرض الأهداف المقترحة
            </button>
            {/* <p className="text-sm mt-3 text-gray-500">النتيجة الحالية: {totalScore} نقاط.</p> */}
        </div>
    );
};
const TiredTestStep3 = ({ suggestedTasks, restartTest }) => (
    <div className="p-8 bg-white rounded-xl w-full max-w-lg shadow-2xl relative text-center transform transition-all scale-100" dir="rtl">
        <h2 className="text-xl font-bold mb-8 text-gray-800 border-b pb-3">هذه المهام المقترحة لك</h2>
        
        <div className="grid grid-cols-2 gap-4">
            {suggestedTasks.length > 0 ? (
                suggestedTasks.map(task => (
                    // PASS THE task.type TO THE TaskCard for icon lookup
                    <div key={task._id || JSON.stringify(task)} className="p-4 bg-[#FFF7EC] rounded-xl shadow-lg flex flex-col items-center">
                        <div className="w-12 h-12 mb-2 relative">
                            <Image 
                                src={TaskIconMap[task.type] || TaskIconMap.default} 
                                alt={task.title} 
                                layout="fill" 
                                objectFit="contain" 
                            />
                        </div>
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
const DashboardView = ({ advice, user }) => {
    // ... (States remain the same) ...
    const [allTasks, setAllTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [testStep, setTestStep] = useState(1);
    const [headache, setHeadache] = useState(null);
    const [tirednessLevelScore, setTirednessLevelScore] = useState(null); 
    const userId  = JSON.parse(localStorage.getItem('user'))._id || JSON.parse(localStorage.getItem('user')).id; 

    useEffect(() => {
        const fetchTasks = async () => {

            setIsLoading(true);
            try {
                // يجب استبدال هذا برمز جلب المهام الفعلي
                const response = await fetch(`${API_BASE_URL}tasks/${userId}`);
                const data = await response.json();

                const fetchedTasks = data.data || data; 
                // نفترض أن API يرجع مصفوفة من الأهداف (allTasks)
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

    const closeModal = useCallback(() => {
        setShowModal(false);
        setTestStep(1); 
        setHeadache(null);
        setTirednessLevelScore(null);
    }, []);

    const startTest = () => {
        setShowModal(true);
        setTestStep(1);
        setHeadache(null);
        setTirednessLevelScore(null);
    };

    const nextStep = () => {
        setTestStep(prev => prev + 1);
    };
    
    const restartTest = () => {
        closeModal();
    }
    
    const todaysTasks = useMemo(() => allTasks.slice(0, 3), [allTasks]);

    const suggestedTasks = useMemo(() => {
        if (tirednessLevelScore === null || headache === null) return [];
        
        let questionnaireScore = (tirednessLevelScore || 0);
        
        const headachePoints = headache === true ? 1 : 0; 
        
        const finalScore = questionnaireScore + headachePoints;
        
        console.log(`Final Tiredness Score: ${finalScore}`);
        
        return getSuggestedTasks(finalScore, allTasks);

    }, [tirednessLevelScore, headache, allTasks]);


    // Determine Modal Content based on Test Step
    const ModalContent = useMemo(() => {
        switch (testStep) {
            case 1:
                return <TiredTestStep1 setHeadache={setHeadache} nextStep={nextStep} closeModal={closeModal} />;
            case 2:
                return <TiredTestStep2 setTirednessScore={setTirednessLevelScore} nextStep={nextStep} closeModal={closeModal} />;
            case 3:
                return <TiredTestStep3 suggestedTasks={suggestedTasks} restartTest={restartTest} />;
            default:
                return null;
        }
    }, [testStep, suggestedTasks, closeModal]);


    return (
        <div className="text-right">
            <h2 className="text-3xl font-extrabold text-center md:text-start text-gray-800 mb-8">أهلاً، {user?.firstName} {user?.lastName}</h2>

            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 md:col-span-3 align-content-center space-y-4">
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
                <div className="lg:col-span-1 md:col-span-3 text-center space-y-4">
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-300">
                        <Image 
                            src={cup_icon}
                            alt="Cup Icon"
                            width={50}
                            height={50}
                            className="mx-auto mb-4"
                        />
                        <p className='fw-[900]'>مستعد لإنجاز جديد! </p>
                        <p className="text-gray-700 text-xs mb-4">هيا قم بإضافة المزيد من المهام</p>
                        <a href="/dashboard/tasks" className="py-2 px-6 bg-indigo-500 text-white text-nowrap font-semibold rounded-lg hover:bg-indigo-600 transition-colors shadow-md">
                            مهمة جديد
                        </a>
                    </div>
                </div>
            </section >
                        <div className="mt-10 mx-auto ">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">مهام اليوم</h3>
                            {isLoading ? (
                                <p className="text-gray-600">جاري تحميل الأهداف...</p>
                            ) : (
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    {todaysTasks.length > 0 ? (todaysTasks.map(task => (
                                        <TaskCard 
                                            key={task._id} 
                                            title={task?.title} 
                                            taskType={task?.type} // Pass the task type
                                        />
                                    ))) : (
                                        <p className="text-gray-600">لا توجد مهام محددة لليوم.</p>
                                    )}
                                </div>
                            )}
                        </div>
            {showModal && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4"
                    onClick={(e) => { 
                        // Only close modal if clicking the backdrop AND on step 1 or 2
                        if (e.currentTarget === e.target && (testStep === 1 || testStep === 2)) closeModal(); 
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape' && (testStep === 1 || testStep === 2)) closeModal();
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
    // get user
    const { user } = useAuth();

    // Handle generate a new advice everyday
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

    const dailyAdvice = getDailyAdvice();
    return (
        <main >
            <DashboardView advice={dailyAdvice} user={user} />
        </main>
    );
};

export default Dashboard;