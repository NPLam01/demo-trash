import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import budgetService from '../services/budgetService';

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await budgetService.getAllBudgets();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createBudget = createAsyncThunk(
  'budgets/create',
  async (budgetData, thunkAPI) => {
    try {
      return await budgetService.createBudget(budgetData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const editBudget = createAsyncThunk(
  'budgets/update',
  async ({ id, budgetData }, thunkAPI) => {
    try {
      return await budgetService.updateBudget(id, budgetData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeBudget = createAsyncThunk(
  'budgets/delete',
  async (id, thunkAPI) => {
    try {
      await budgetService.deleteBudget(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  budgets: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create budget
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets.push(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update budget
      .addCase(editBudget.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.budgets.findIndex(budget => budget._id === action.payload._id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(editBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete budget
      .addCase(removeBudget.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets = state.budgets.filter(budget => budget._id !== action.payload);
      })
      .addCase(removeBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = budgetSlice.actions;
export default budgetSlice.reducer;
