import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMissions = createAsyncThunk('missions/fetchMissions', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}missions`);
  if (!response.ok) {
    throw new Error('فشل في تحميل المهام.');
  }
  return await response.json();
});

// Async thunk to fetch all tasks from the API
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks`);
  if (!response.ok) {
    throw new Error('فشل في تحميل المهام.');
  }
  return await response.json();
});

// Async thunk to add a new task
export const addTaskAsync = createAsyncThunk('tasks/addTask', async (taskData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('فشل في إضافة المهمة.');
  }
  return response.json();
});

// Async thunk to edit an existing task
export const editTaskAsync = createAsyncThunk('tasks/editTask', async (taskData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks/${taskData._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('فشل في تعديل المهمة.');
  }
  return response.json();
});

// Async thunk to update a task's status
export const updateTaskStatusAsync = createAsyncThunk('tasks/updateTaskStatus', async ({ id, status }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('فشل في تحديث حالة المهمة.');
  }
  return response.json();
});

// Async thunk to update a task's priority
export const updateTaskPriorityAsync = createAsyncThunk('tasks/updateTaskPriority', async ({ id, priority }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks/${id}/priority`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priority }),
  });
  if (!response.ok) {
    throw new Error('فشل في تحديث أولوية المهمة.');
  }
  return response.json();
});

// Async thunk to delete a task
export const deleteTaskAsync = createAsyncThunk('tasks/deleteTask', async (id) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('فشل في حذف المهمة.');
  }
  return id;
});

// Create the slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    missions: [], // <-- missions array added to initial state
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch missions
      .addCase(fetchMissions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.missions = action.payload;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add task
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      // Edit task
      .addCase(editTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      
      // Update task status
      .addCase(updateTaskStatusAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index].status = action.payload.status;
        }
      })

      // Update task priority
      .addCase(updateTaskPriorityAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index].priority = action.payload.priority;
        }
      })

      // Delete task
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      });
  },
});

export const tasksReducer = tasksSlice.reducer;
