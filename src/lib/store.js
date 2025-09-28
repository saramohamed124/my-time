'use client';

import { configureStore } from '@reduxjs/toolkit';
import {tasksReducer} from './features/todos/todoSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer, // Add the todos reducer here
  },
});

export default store;
