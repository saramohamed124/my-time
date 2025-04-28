'use client';

import { configureStore } from '@reduxjs/toolkit';
import { todoReducer } from '@/lib/features/todos/todoSlice';

const store = configureStore({
  reducer: {
    todos: todoReducer, // Add the todos reducer here
  },
});

export default store;
