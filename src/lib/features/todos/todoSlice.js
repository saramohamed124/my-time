import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all todos
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}todos`); // Replace with your API
  return response.json();
});

// Add a new Todo
export const addTodoAsync = createAsyncThunk('todos/addTodo', async (todoData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todoData),
  });
  return response.json(); // Assuming API returns the added todo
});

// Edit an existing Todo
export const editTodoAsync = createAsyncThunk('todos/editTodo', async (todoData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}todos/${todoData._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todoData),
  });
  return response.json(); // Assuming API returns the updated todo
});

// Delete a Todo
export const deleteTodoAsync = createAsyncThunk('todos/deleteTodo', async (id) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}todos/${id}`, {
    method: 'DELETE',
  });
  return id; // Return the id to remove it from state
});

// Create the slice
const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add todo
      .addCase(addTodoAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos.push(action.payload);
      })
      .addCase(addTodoAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Edit todo
      .addCase(editTodoAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editTodoAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload; // Replace the todo with updated one
        }
      })
      .addCase(editTodoAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Delete todo
      .addCase(deleteTodoAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = state.todos.filter((todo) => todo.id !== action.payload); // Remove the deleted todo
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const todoReducer = todoSlice.reducer;
