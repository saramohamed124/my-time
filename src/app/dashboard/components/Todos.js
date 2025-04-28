'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchTodos, addTodoAsync, editTodoAsync, deleteTodoAsync } from '@/lib/features/todos/todoSlice';

// ثابت لقيم الأنواع
const TASK_TYPES = ['exam', 'interview', 'task'];
const TASK_LEVELS = ['beginner', 'intermediate', 'advanced'];

const Todos = () => {
  const dispatch = useDispatch();
  const { todos, status, error } = useSelector((state) => state.todos);

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    type: '',
    level: '',
  });

  const [editingTodo, setEditingTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addTodoAsync(newTodo)).unwrap();
      setNewTodo({ title: '', description: '', type: '', level: '' });
    dispatch(fetchTodos());
      setShowModal(false);
      setFormError('');
    } catch (err) {
      setFormError('حدث خطأ أثناء إضافة المهمة. حاول مجددًا.');
    }
  };

  const handleEditTodo = async (e) => {
    e.preventDefault();
    try {
      await dispatch(editTodoAsync(editingTodo)).unwrap();
      setEditingTodo(null);
      dispatch(fetchTodos());
      setShowModal(false);
      setFormError('');
    } catch (err) {
      setFormError('حدث خطأ أثناء تعديل المهمة. حاول مجددًا.');
    }
  };

  const handleDeleteTodo = async (id) => {
    await dispatch(deleteTodoAsync(id));
    dispatch(fetchTodos());
  };

  const openAddModal = () => {
    setNewTodo({ title: '', description: '', type: '', level: '' });
    setEditingTodo(null);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setShowModal(true);
    setFormError('');
  };

  return (
    <article className="p-6">
      {/* Header */}
      <section className='flex flex-wrap w-full justify-between my-3 gap-2'>
        <h1 className="text-3xl font-semibold text-center">قائمة المهام</h1>
        <div className="text-center">
          <button
            onClick={openAddModal}
            className="py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
          >
            إضافة مهمة جديدة
          </button>
        </div>
      </section>

      {/* Status */}
      {status === 'loading' && <p className="text-center text-gray-500">جاري التحميل...</p>}
      {status === 'failed' && <p className="text-center text-red-500">خطأ: {error}</p>}

      {/* Tasks List */}
      {status === 'succeeded' && (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo._id} className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 transition-all">
              <h2 className="text-xl font-bold">{todo.title}</h2>
              <p className="text-gray-600">{todo.description}</p>
              <p className="text-sm text-gray-500 mt-2">نوع المهمة: {todo.type}</p>
              <p className="text-sm text-gray-500">مستوى المهمة: {todo.level}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
                >
                  حذف
                </button>
                <button
                  onClick={() => openEditModal(todo)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                >
                  تعديل
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#80808042] z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">
              {editingTodo ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
            </h2>

            {formError && (
              <p className="text-red-500 text-center mb-4">{formError}</p>
            )}

            <form onSubmit={editingTodo ? handleEditTodo : handleAddTodo} className="space-y-4">
              {/* عنوان المهمة */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">عنوان المهمة</label>
                <input
                  type="text"
                  id="title"
                  value={editingTodo ? editingTodo.title : newTodo.title}
                  onChange={(e) =>
                    editingTodo
                      ? setEditingTodo({ ...editingTodo, title: e.target.value })
                      : setNewTodo({ ...newTodo, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* وصف المهمة */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">وصف المهمة</label>
                <textarea
                required
                  id="description"
                  value={editingTodo ? editingTodo.description : newTodo.description}
                  onChange={(e) =>
                    editingTodo
                      ? setEditingTodo({ ...editingTodo, description: e.target.value })
                      : setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* نوع المهمة */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">نوع المهمة</label>
                <select
                  id="type"
                  value={editingTodo ? editingTodo.type : newTodo.type}
                  onChange={(e) =>
                    editingTodo
                      ? setEditingTodo({ ...editingTodo, type: e.target.value })
                      : setNewTodo({ ...newTodo, type: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">اختر النوع</option>
                  {TASK_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* مستوى المهمة */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">مستوى المهمة</label>
                <select
                  id="level"
                  value={editingTodo ? editingTodo.level : newTodo.level}
                  onChange={(e) =>
                    editingTodo
                      ? setEditingTodo({ ...editingTodo, level: e.target.value })
                      : setNewTodo({ ...newTodo, level: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">اختر المستوى</option>
                  {TASK_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-all"
              >
                {editingTodo ? 'حفظ التعديلات' : 'إضافة المهمة'}
              </button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
};

export default Todos;
