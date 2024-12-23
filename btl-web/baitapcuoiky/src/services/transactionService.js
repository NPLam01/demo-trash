import api from './api';

export const transactionService = {
    getAllTransactions: async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            console.log('Getting transactions for userId:', userId);
            const response = await api.get(`/expense/get-all?userId=${userId}`);
            console.log('Get all transactions response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in getAllTransactions:', error);
            throw error.response?.data || { message: 'Lỗi khi lấy danh sách giao dịch' };
        }
    },

    addTransaction: async (transactionData) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            console.log('Adding transaction for userId:', userId);
            console.log('Transaction data:', transactionData);

            const formattedData = {
                userId,
                category: transactionData.category || 'Khác',
                amount: Number(transactionData.type === 'expense' ? -Math.abs(transactionData.amount) : Math.abs(transactionData.amount)),
                date: new Date(transactionData.date).toISOString(),
                note: transactionData.note || '',
                type: transactionData.type
            };

            console.log('Formatted data:', formattedData);

            const response = await api.post('/expense/create-expense', formattedData);
            console.log('Add transaction response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error in addTransaction:', error);
            throw error.response?.data || { message: 'Lỗi khi thêm giao dịch' };
        }
    },

    updateTransaction: async (id, transactionData) => {
        try {
            if (!id) {
                throw new Error('Transaction ID is required');
            }

            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            console.log('Updating transaction:', { id, transactionData });

            const formattedData = {
                userId,
                category: transactionData.category || 'Khác',
                amount: Number(transactionData.type === 'expense' ? -Math.abs(transactionData.amount) : Math.abs(transactionData.amount)),
                date: new Date(transactionData.date).toISOString(),
                note: transactionData.note || '',
                type: transactionData.type
            };

            console.log('Formatted update data:', formattedData);

            const response = await api.put(`/expense/update-expense/${id}`, formattedData);
            console.log('Update response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in updateTransaction:', error);
            throw error.response?.data || { message: 'Lỗi khi cập nhật giao dịch' };
        }
    },

    deleteTransaction: async (id) => {
        try {
            if (!id) {
                throw new Error('Transaction ID is required');
            }

            console.log('Deleting transaction:', id);

            const response = await api.delete(`/expense/delete-expense/${id}`);
            console.log('Delete response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in deleteTransaction:', error);
            throw error.response?.data || { message: 'Lỗi khi xóa giao dịch' };
        }
    }
};

export const budgetService = {
    getAllBudgets: async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            const response = await api.get(`/monthlyLimit/get-all?userId=${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Lỗi khi lấy danh sách ngân sách' };
        }
    },

    addBudget: async (budgetData) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            const response = await api.post('/monthlyLimit/create-monthlyLimit', {
                ...budgetData,
                userId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Lỗi khi thêm ngân sách' };
        }
    },

    updateBudget: async (id, budgetData) => {
        try {
            if (!id) {
                throw new Error('Budget ID is required');
            }

            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            const response = await api.put(`/monthlyLimit/update-monthlyLimit/${id}`, {
                ...budgetData,
                userId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Lỗi khi cập nhật ngân sách' };
        }
    },

    deleteBudget: async (id) => {
        try {
            if (!id) {
                throw new Error('Budget ID is required');
            }

            const response = await api.delete(`/monthlyLimit/delete-monthlyLimit/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Lỗi khi xóa ngân sách' };
        }
    }
};
