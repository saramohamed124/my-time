'use client'; // أضف هذا السطر في البداية

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '@/lib/features/todos/todoSlice'; // استيراد العمل

const AddTodo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // إنشاء مهمة جديدة
    const newTodo = {
      title,
      description,
      completed: false,
      type: 'task',
    };

    // إرسال العمل لإضافة المهمة الجديدة
    dispatch(addTodo(newTodo));

    // مسح الحقول بعد الإرسال
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">إضافة مهمة جديدة</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-2">
          عنوان المهمة
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="أدخل عنوان المهمة"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-2">
          وصف المهمة
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="أدخل وصف المهمة"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        إضافة المهمة
      </button>
    </form>
  );
};

export default AddTodo;
