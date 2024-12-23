import api from './api';

// Lấy tất cả ngân sách
const getAllBudgets = async () => {
  const response = await api.get('/budgets');
  return response.data;
};

// Tạo ngân sách mới
const createBudget = async (budgetData) => {
  const response = await api.post('/budgets', budgetData);
  return response.data;
};

// Cập nhật ngân sách
const updateBudget = async (id, budgetData) => {
  const response = await api.put(`/budgets/${id}`, budgetData);
  return response.data;
};

// Xóa ngân sách
const deleteBudget = async (id) => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};

const budgetService = {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
};

export default budgetService;
