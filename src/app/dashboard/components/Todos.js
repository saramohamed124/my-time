'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
// Assuming '@/lib/features/todos/todoSlice' correctly resolves and contains the necessary thunks
import {
  fetchTasks,
  addTaskAsync,
  editTaskAsync,
  deleteTaskAsync,
  updateTaskStatusAsync,
  fetchMissions
} from '@/lib/features/todos/todoSlice';
import Link from 'next/link';

// Hardcoded for consistency, could be fetched from API in a real app
// --- Status Translations ---
export const STATUS_OPTIONS = {
    'pending': 'معلق',
    'in-progress': 'قيد التقدم',
    'completed': 'مكتمل',
};

// --- Priority Translations ---
export const PRIORITY_OPTIONS = {
    'low': 'منخفض',
    'medium': 'متوسط',
    'high': 'عالي',
};

// --- Difficulty Translations (from previous fix) ---
export const DIFFICULTY_LEVELS = {
    'easy': 'سهل',
    'intermediate': 'متوسط',
    'hard': 'صعب',
};

// --- Task Type Translations (Matching your TaskIconMap) ---
export const type_OPTIONS = {
    'study': 'دراسة/تعلم',
    'soft_skills': 'مهارات ناعمة',
    'mental_break': 'راحة عقلية',
    'physical': 'نشاط بدني',
    'review': 'مراجعة',
    'other': 'أخرى',
};
// Function to map priority to a color for the flag icon
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-blue-500';
    default:
      return 'text-gray-400';
  }
};

// Main Tasks Component
const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, missions, status, error } = useSelector((state) => state.tasks);

  const userId  = JSON.parse(localStorage.getItem('user'))._id || JSON.parse(localStorage.getItem('user')).id; 
  // Initial state for a new task (fixed the duplicated 'due_date' field)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    difficulty_level: '',
    priority: '',
    status: 'pending',
    mission_id: '',
    type: '',
    userId: userId
  });

  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [filterMission, setFilterMission] = useState('all');

  // Fetch tasks and missions on initial load
  useEffect(() => {
    dispatch(fetchTasks(userId));
    dispatch(fetchMissions(userId));
  }, [dispatch]);

  // Helper function to get mission title from ID
  const getMissionTitle = (id) => {
    const mission = missions.find(m => m._id === id);
    return mission ? mission.title : 'غير محددة';
  };

  // Filter tasks based on the selected mission
  const filteredTasks = tasks.filter(task =>
    filterMission === 'all' || task.mission_id === filterMission
  );

  // Split tasks into pending and completed for separate display
  const pendingTasks = filteredTasks.filter(task => task.status !== 'completed');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  // Calculate summary statistics
  const pendingCount = pendingTasks.length;
  const completedCount = completedTasks.length;
  // Note: due_date is used here for estimated hours (assuming it's stored as a string that needs parsing)
  const totalHours = tasks.reduce((sum, task) => sum + (parseInt(task.due_date) || 0), 0);

  // --- Input Validation Logic ---
  const validateForm = (taskData) => {
    if (!taskData.title.trim()) {
      return 'الرجاء إدخال عنوان المهمة.';
    }
    // if (!taskData.description.trim()) {
    //   return 'الرجاء إدخال وصف المهمة.';
    // }
    // Regex: check for valid selection
    if (!taskData.mission_id || taskData.mission_id === '') {
      return 'الرجاء اختيار المهمة.';
    }
    if (!taskData.priority || taskData.priority === '') {
      return 'الرجاء اختيار الأولوية.';
    }
    if (!taskData.type || taskData.type === '') {
      return 'الرجاء اختيار نوع المهمة.';
    }
    if (!taskData.difficulty_level || taskData.difficulty_level === '') {
      return 'الرجاء اختيار مستوى الصعوبة.';
    }
    // Regex: check for non-negative integer for estimated hours
const hours = parseInt(taskData.due_date);
    if (isNaN(hours) || hours < 0 || !/^\d+$/.test(taskData.due_date)) {
      return 'الرجاء إدخال عدد صحيح موجب أو صفر لعدد الساعات المقدرة.';
    }
    return ''; // No errors
  };

  // --- Handlers ---

  const handleAddTask = async (e) => {
    e.preventDefault();
    setFormError('');
    console.log('Adding Task:', newTask);
    const validationError = validateForm(newTask);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      // Ensure due_date is sent as an integer
        await dispatch(addTaskAsync({ 
              taskData: { 
                ...newTask, 
                // Ensure due_date is an integer as expected by your thunk logic
                due_date: parseInt(newTask.due_date) || 0 ,
              }, 
              userId 
            })).unwrap();
      setNewTask({
        title: '',
        description: '',
        due_date: '',
        difficulty_level: '',
        type: '',
        priority: '',
        status: 'pending',
        mission_id: '',
    type: '',
        user_id: userId
      });
      setShowModal(false);
    } catch (err) {
      setFormError('حدث خطأ أثناء إضافة المهمة. حاول مجددًا.');
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    setFormError('');

    const validationError = validateForm(editingTask);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      // Ensure due_date is sent as an integer
      await dispatch(editTaskAsync({ ...editingTask, due_date: parseInt(editingTask.due_date) || 0 })).unwrap();
      setEditingTask(null);
      setShowModal(false);
    } catch (err) {
      setFormError('حدث خطأ أثناء تعديل المهمة. حاول مجددًا.');
    }
  };

  const handleDeleteTask = async (id) => {
    await dispatch(deleteTaskAsync(id));
  };

  const handleUpdateStatus = (id, newStatus) => {
    dispatch(updateTaskStatusAsync({ id, status: newStatus }));
  };

  const handleInputChange = (e, isEditing) => {
    const { id, value } = e.target;
    // Special handling for number input (due_date/estimated hours)
    const processedValue = id === 'due_date' ? value.replace(/[^0-9]/g, '') : value;

    if (isEditing) {
      setEditingTask((prev) => ({ ...prev, [id]: processedValue }));
    } else {
      setNewTask((prev) => ({ ...prev, [id]: processedValue }));
    }
  };

  const openAddModal = () => {
    setNewTask({
      title: '',
      description: '',
      due_date: '',
      difficulty_level: '',
      priority: '',
      type: '',
      status: 'pending',
      mission_id: ''
    });
    setEditingTask(null);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (task) => {
    // Ensure estimated hours (due_date) is treated as a string for the input field
    setEditingTask({ ...task, due_date: parseInt(task.due_date) });
    setShowModal(true);
    setFormError('');
  };

  return (
    <article className="p-4 sm:p-6  min-h-screen font-sans text-right" dir="rtl">
      {/* Header & Add Task Button */}
      <section className="flex flex-wrap w-full justify-between my-3 gap-4 items-center pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">قائمة المهام</h1>
        <div className="text-center">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 py-2 px-4 sm:py-3 sm:px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg text-sm sm:text-base"
          >
            {/* Plus Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            إضافة مهمة جديدة
          </button>
        </div>
      </section>

      {/* Filter by Mission */}
      <section className="my-6">
        <label htmlFor="mission-filter" className="text-sm font-medium text-gray-700 block mb-2">تصفية حسب الهدف</label>
        <select
          id="mission-filter"
          value={filterMission}
          onChange={(e) => setFilterMission(e.target.value)}
          className="p-3 w-full sm:max-w-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
        >
          <option value="all">جميع الأهداف</option>
          {missions?.map((mission) => (
            <option key={mission._id} value={mission._id}>{mission.title}</option>
          ))}
        </select>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-t-indigo-500">
          <p className="text-4xl font-extrabold text-gray-800">{pendingCount}</p>
          <p className="text-sm text-gray-500 mt-1">المهام المعلقة</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-t-green-500">
          <p className="text-4xl font-extrabold text-gray-800">{completedCount}</p>
          <p className="text-sm text-gray-500 mt-1">المهام المكتملة</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-t-blue-500">
          <p className="text-4xl font-extrabold text-gray-800">{totalHours}h</p>
          <p className="text-sm text-gray-500 mt-1">إجمالي الساعات المقدرة</p>
        </div>
      </section>

      {/* Status */}
      {status === 'loading' && <p className="text-center text-gray-500">جاري التحميل...</p>}
      {status === 'failed' && <p className="text-center text-red-500">خطأ: {error}</p>}

      {status === 'succeeded' && (
        <section className="space-y-12">
          {/* Pending Tasks Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
              المهام المعلقة ({pendingTasks.length})
            </h2>
            {pendingTasks.length > 0 ? (
              <ul className="space-y-4">
                {pendingTasks.map((task) => (
                  <li key={task._id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-r-4 border-r-indigo-400">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {/* Status Checkbox Button (Pending -> Completed) */}
                        <button 
                          onClick={() => handleUpdateStatus(task._id, 'completed')} 
                          className="text-gray-400 hover:text-green-500 transition-colors flex-shrink-0" 
                          title="تم الإنجاز"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          </svg>
                        </button>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">{task.title}</h2>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm pr-9">{task.description}</p>
                      
                      {/* Metadata Tags */}
                      <div className="flex flex-wrap gap-2 text-xs pr-9">
                          {task.mission_id && (
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium shadow-sm">
                              {getMissionTitle(task.mission_id)}
                            </div>
                          )}
                           <div className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full">
                              {task.difficulty_level}
                            </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 text-sm text-gray-500 flex-shrink-0">
                      {/* Priority and Hours */}
                      <div className="flex items-center gap-1">
                        {/* Priority Icon (Fill color changes based on priority) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${getPriorityColor(task.priority)}`} viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M20 17h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zM18 5H4v14h14V5zm-4 2v10h-2V7h2zm-4 0v10H8V7h2z" fill="currentColor"></path>
                        </svg>
                        <span className={`font-semibold ${getPriorityColor(task.priority)}`}>الأولوية: {task.priority}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                       {new Date(task.due_date).toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
  })}ساعة مقدرة
                      </div>

                      {/* Action Buttons: Edit and Delete */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 w-full justify-end">
                        <button 
                          onClick={() => openEditModal(task)} 
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full bg-blue-50/50"
                          title="تعديل المهمة"
                        >
                          {/* Edit Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>

                        <button 
                          onClick={() => handleDeleteTask(task._id)} 
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full bg-red-50/50"
                          title="حذف المهمة"
                        >
                          {/* Trash Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-500 text-center mt-4 p-8 bg-white rounded-xl shadow-inner">لا توجد مهام معلقة حاليًا في هذه المهمة.</p>
            )}
          </div>

          {/* Completed Tasks Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              المهام المكتملة ({completedTasks.length})
            </h2>
            {completedTasks.length > 0 ? (
              <ul className="space-y-4">
                {completedTasks.map((task) => (
                  <li key={task._id} className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-60 hover:opacity-100 transition-all border-r-4 border-r-green-400">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                         {/* Status Checkbox Button (Completed -> Pending) */}
                        <button 
                          onClick={() => handleUpdateStatus(task._id, 'pending')} 
                          className="text-green-500 hover:text-gray-400 transition-colors flex-shrink-0" 
                          title="إعادة للتعليق"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </button>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 line-through">{task.title}</h2>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm pr-9">{task.description}</p>
                      
                      {/* Metadata Tags */}
                      <div className="flex flex-wrap gap-2 text-xs pr-9">
                          {task.mission_id && (
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium shadow-sm">
                              {getMissionTitle(task.mission_id)}
                            </div>
                          )}
                           <div className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full">
                              {task.difficulty_level}
                            </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 text-sm text-gray-500 flex-shrink-0">
                      {/* Priority and Hours */}
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${getPriorityColor(task.priority)}`} viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M20 17h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zM18 5H4v14h14V5zm-4 2v10h-2V7h2zm-4 0v10H8V7h2z" fill="currentColor"></path>
                        </svg>
                        <span className={`font-semibold ${getPriorityColor(task.priority)}`}>الأولوية: {task.priority}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {task.due_date}ساعة مقدرة
                      </div>
                      
                      {/* Action Buttons: Edit and Delete (Still available for completed tasks) */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 w-full justify-end">
                        <button 
                          onClick={() => openEditModal(task)} 
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full bg-blue-50/50"
                          title="تعديل المهمة"
                        >
                          {/* Edit Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>

                        <button 
                          onClick={() => handleDeleteTask(task._id)} 
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full bg-red-50/50"
                          title="حذف المهمة"
                        >
                          {/* Trash Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-500 text-center mt-4 p-8 bg-white rounded-xl shadow-inner">لا توجد مهام مكتملة في هذه المهمة.</p>
            )}
          </div>
        </section>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-[#80808066] z-50 p-4"
          onClick={(e) => { 
            // Close on backdrop click
            if (e.currentTarget === e.target) setShowModal(false); 
          }}
          onKeyDown={(e) => {
              // Close on Escape key press (A11y improvement)
              if (e.key === 'Escape') setShowModal(false);
          }}
          tabIndex={-1} // Makes the div focusable for onKeyDown to work
        >
          <div className="bg-white p-6 sm:p-8 rounded-xl w-full max-w-lg shadow-2xl relative text-right transform transition-all scale-100 max-h-full overflow-y-scroll" dir="rtl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 left-3 text-gray-400 hover:text-gray-700 text-3xl transition-colors p-2"
              title="إغلاق"
            >
              &times;
            </button>

            <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800 pb-3">
              {editingTask ? 'تعديل بيانات المهمة' : 'إنشاء مهمة جديدة'}
            </h2>

            {formError && (
              <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-center mb-4 text-sm font-medium">{formError}</p>
            )}

            <form onSubmit={editingTask ? handleEditTask : handleAddTask} className="space-y-4">
              {/* Mission Selection */}
              <div>
                <label htmlFor="mission_id" className="block text-sm font-medium text-gray-700 mb-1">الهدف <span className="text-red-500">*</span></label>
                {missions?.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-2">لا توجد أهداف متاحة. <Link className='text-indigo-600 underline' href={'/dashboard/missions'}>الرجاء إنشاء هدف أولاً</Link>.</p>
                ) : (
                <select
                  id="mission_id"
                  value={editingTask ? editingTask.mission_id : newTask.mission_id}
                  onChange={(e) => handleInputChange(e, !!editingTask)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  required
                >
                  <option value="">اختر الهدف</option>
                  {missions?.map((mission) => (
                    <option  key={mission._id} value={mission._id}>{mission.title}</option>
                  ))}
                </select>

                )}
              </div>

              {/* Task Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">عنوان المهمة <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="title"
                  value={editingTask ? editingTask.title : newTask.title}
                  onChange={(e) => handleInputChange(e, !!editingTask)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">وصف المهمة </label>
                <textarea
                  // required
                  id="description"
                  rows="3"
                  value={editingTask ? editingTask.description : newTask.description}
                  onChange={(e) => handleInputChange(e, !!editingTask)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
              </div>

              {/* Priority & Estimated Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">الأولوية <span className="text-red-500">*</span></label>
                  <select
                    id="priority"
                    value={editingTask ? editingTask.priority : newTask.priority}
                    onChange={(e) => handleInputChange(e, !!editingTask)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    required
                  >
                    <option value="">اختر الأولوية</option>
                    {Object.keys(PRIORITY_OPTIONS).map((p) => (
                      <option key={p} value={p}>{PRIORITY_OPTIONS[p] || p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">نوع المهمة<span className="text-red-500">*</span></label>
                  <select
                    id="type"
                    value={editingTask ? editingTask.type : newTask.type}
                    onChange={(e) => handleInputChange(e, !!editingTask)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    required
                  >
                    <option value="">اختر نوع المهمة </option>
                    {Object.keys(type_OPTIONS).map((key) => (
                      <option key={key} value={key}>{type_OPTIONS[key]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">الساعات المقدرة <span className="text-red-500">*</span></label>
                  <input
                    type="text" // Use text to allow filtering of non-numeric input easily with regex in handler
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="due_date"
                    value={editingTask ? editingTask.due_date : newTask.due_date}
                    onChange={(e) => handleInputChange(e, !!editingTask)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    required
                  />
                </div>
              </div>

              {/* Difficulty & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700 mb-1">مستوى الصعوبة <span className="text-red-500">*</span></label>
                  <select
                    id="difficulty_level"
                    value={editingTask ? editingTask.difficulty_level : newTask.difficulty_level}
                    onChange={(e) => handleInputChange(e, !!editingTask)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    required
                  >
                    <option value="">اختر مستوى الصعوبة</option>
                    {Object.keys(DIFFICULTY_LEVELS).map((p) => (
                      <option key={p} value={p}>{DIFFICULTY_LEVELS[p] || p}</option>
                    ))}
                  </select>
                </div>

                {/* Status (Only available when editing) */}
                {editingTask && (
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">الحالة <span className="text-red-500">*</span></label>
                    <select
                      id="status"
                      value={editingTask.status}
                      onChange={(e) => handleInputChange(e, !!editingTask)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      required
                    >
                      {Object.keys(STATUS_OPTIONS).map((p) => (
                        <option key={p} value={p}>{STATUS_OPTIONS[p] || p}</option>
                      ))}
                    </select>
                  </div>
                )}
                
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg font-semibold text-lg"
              >
                {editingTask ? 'حفظ التعديلات' : 'إنشاء المهمة'}
              </button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
};

export default Tasks;
