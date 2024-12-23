import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { transactionService } from '../services/transactionService';

// Async thunk actions
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async () => {
        const response = await transactionService.getAllTransactions();
        return response.data || [];
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async (transactionData) => {
        const response = await transactionService.addTransaction(transactionData);
        return response.data;
    }
);

export const editTransaction = createAsyncThunk(
    'transactions/editTransaction',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            if (!id) {
                throw new Error('Transaction ID is required');
            }
            const response = await transactionService.updateTransaction(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeTransaction = createAsyncThunk(
    'transactions/removeTransaction',
    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                throw new Error('Transaction ID is required');
            }
            await transactionService.deleteTransaction(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    transactions: [],
    totalIncome: 0,
    totalExpense: 0,
    filters: {
        category: null,
        startDate: null,
        endDate: null,
        type: 'all',
    },
    status: 'idle',
    error: null
};

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch transactions
            .addCase(fetchTransactions.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactions = Array.isArray(action.payload) ? action.payload : [];
                
                // Tính toán tổng thu/chi dựa trên giá trị amount
                state.totalIncome = state.transactions
                    .filter(t => t.amount > 0)
                    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);
                    
                state.totalExpense = state.transactions
                    .filter(t => t.amount < 0)
                    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create transaction
            .addCase(createTransaction.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload && action.payload.data) {
                    state.transactions.push(action.payload.data);
                    const amount = parseFloat(action.payload.data.amount) || 0;
                    if (amount > 0) {
                        state.totalIncome += Math.abs(amount);
                    } else {
                        state.totalExpense += Math.abs(amount);
                    }
                }
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Edit transaction
            .addCase(editTransaction.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(editTransaction.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload && action.payload.data) {
                    const index = state.transactions.findIndex(t => t._id === action.payload.data._id);
                    if (index !== -1) {
                        const oldTransaction = state.transactions[index];
                        const oldAmount = parseFloat(oldTransaction.amount) || 0;
                        const newAmount = parseFloat(action.payload.data.amount) || 0;

                        // Cập nhật tổng thu/chi
                        if (oldAmount > 0) {
                            state.totalIncome -= Math.abs(oldAmount);
                        } else {
                            state.totalExpense -= Math.abs(oldAmount);
                        }

                        if (newAmount > 0) {
                            state.totalIncome += Math.abs(newAmount);
                        } else {
                            state.totalExpense += Math.abs(newAmount);
                        }

                        // Cập nhật giao dịch
                        state.transactions[index] = action.payload.data;
                    }
                }
            })
            .addCase(editTransaction.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Could not update transaction';
            })
            // Remove transaction
            .addCase(removeTransaction.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(removeTransaction.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const transaction = state.transactions.find(t => t._id === action.payload);
                if (transaction) {
                    const amount = parseFloat(transaction.amount) || 0;
                    if (amount > 0) {
                        state.totalIncome -= Math.abs(amount);
                    } else {
                        state.totalExpense -= Math.abs(amount);
                    }
                    state.transactions = state.transactions.filter(t => t._id !== action.payload);
                }
            })
            .addCase(removeTransaction.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Could not delete transaction';
            });
    }
});

export const { setFilters, clearFilters } = transactionSlice.actions;

// Memoized selectors
const selectTransactions = state => state.transactions.transactions;
const selectFilters = state => state.transactions.filters;

export const selectFilteredTransactions = createSelector(
    [selectTransactions, selectFilters],
    (transactions, filters) => {
        if (!Array.isArray(transactions)) return [];
        
        return transactions.filter(transaction => {
            if (filters.category && transaction.category !== filters.category) return false;
            if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) return false;
            if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) return false;
            if (filters.type !== 'all' && transaction.type !== filters.type) return false;
            return true;
        });
    }
);

export default transactionSlice.reducer;
