'use client';

import React, { useState, useEffect } from 'react';

const MissionModal = ({ onClose, mission }) => {
    const isEditing = !!mission;
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        type: 'study',
        difficulty: 'medium',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (isEditing) {
            setFormData({
                title: mission.title,
                description: mission.description,
                deadline: new Date(mission.end_date).toISOString().split('T')[0],
                type: mission.type,
                difficulty: mission.difficulty,
            });
        }
    }, [isEditing, mission]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};
        // Regex to allow Arabic, English letters, numbers, and common punctuation
        const titleRegex = /^[\u0600-\u06FF\s\w\d.,!?'"()_-]{1,100}$/;
        // Regex for description: same characters, but a longer length
        const descriptionRegex = /^[\u0600-\u06FF\s\w\d.,!?'"()_-]{1,500}$/;

        if (!titleRegex.test(formData.title)) {
            errors.title = 'يجب أن يكون العنوان بين 1 و100 حرف ويحتوي فقط على أحرف وأرقام وعلامات ترقيم.';
        }

        if (!descriptionRegex.test(formData.description)) {
            errors.description = 'يجب أن يكون الوصف بين 1 و500 حرف ويحتوي فقط على أحرف وأرقام وعلامات ترقيم.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Note: localStorage might not be available in all environments.
            const userId = JSON.parse(localStorage.getItem('user'))._id;
            const url = isEditing
                ? `${process.env.NEXT_PUBLIC_API_URL}missions/${mission._id}`
                : `${process.env.NEXT_PUBLIC_API_URL}missions`;
            const method = isEditing ? 'PUT' : 'POST';
            const body = JSON.stringify({
                ...formData,
                start_date: new Date(),
                end_date: new Date(formData.deadline),
                userId: userId,
            });

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: body,
            });

            if (!response.ok) {
                throw new Error('فشل في حفظ المهمة');
            }

            onClose();
        } catch (error) {
            console.error(error);
            setError('حدث خطأ أثناء حفظ المهمة. الرجاء المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl max-h-full overflow-y-scroll">
                <h2 className="text-2xl font-bold mb-4 text-right">
                    {isEditing ? 'تعديل مهمة' : 'إنشاء مهمة جديدة'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right">عنوان المهمة</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md text-right"
                            placeholder="مثال: إتقان أساسيات React"
                            required
                        />
                        {validationErrors.title && (
                            <p className="text-red-500 text-sm text-right mt-1">{validationErrors.title}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right">الوصف</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md text-right"
                            placeholder="صف أهداف مهمتك"
                        ></textarea>
                        {validationErrors.description && (
                            <p className="text-red-500 text-sm text-right mt-1">{validationErrors.description}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right">الموعد النهائي</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md text-right"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right">نوع المهمة</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md text-right"
                            required
                        >
                            <option value="study">دراسة</option>
                            <option value="exam">امتحان</option>
                            <option value="interview">مقابلة عمل</option>
                            <option value="project">مشروع</option>
                            <option value="work">عمل</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-right">مستوى الصعوبة</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md text-right"
                            required
                        >
                            <option value="easy">سهل</option>
                            <option value="medium">متوسط</option>
                            <option value="hard">صعب</option>
                        </select>
                    </div>

                    {error && <p className="text-red-500 text-right mb-4">{error}</p>}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'جارٍ الحفظ...' : 'حفظ المهمة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MissionModal;
