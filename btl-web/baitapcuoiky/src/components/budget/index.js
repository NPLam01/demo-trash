import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createBudget, editBudget } from '../../features/budgetSlice';
import './index.css';

const BudgetForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const editingBudget = location.state?.budget;

  const getCurrentMonthDates = () => {
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endDate = lastDay.toISOString().split('T')[0];
    
    const remainingDays = Math.ceil((lastDay - now) / (1000 * 60 * 60 * 24));
    return { startDate, endDate, remainingDays };
  };

  const { startDate, endDate } = getCurrentMonthDates();

  const [budgetData, setBudgetData] = useState({
    amount: '',
    category: 'Ăn uống',
    startDate,
    endDate,
    note: '',
  });

  useEffect(() => {
    if (editingBudget) {
      setBudgetData({
        ...editingBudget,
        startDate: new Date(editingBudget.startDate).toISOString().split('T')[0],
        endDate: new Date(editingBudget.endDate).toISOString().split('T')[0],
      });
    }
  }, [editingBudget]);

  const categories = [
    { id: 'Ăn uống', name: 'Ăn uống', icon: 'utensils' },
    { id: 'Di chuyển', name: 'Di chuyển', icon: 'bus' },
    { id: 'Giải trí', name: 'Giải trí', icon: 'gamepad' },
    { id: 'Mua sắm', name: 'Mua sắm', icon: 'shopping-bag' },
    { id: 'Hóa đơn', name: 'Hóa đơn', icon: 'file-invoice-dollar' },
    { id: 'Sức khỏe', name: 'Sức khỏe', icon: 'heartbeat' },
    { id: 'Giáo dục', name: 'Giáo dục', icon: 'graduation-cap' },
    { id: 'Khác', name: 'Khác', icon: 'ellipsis-h' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...budgetData,
      amount: parseFloat(budgetData.amount),
      startDate: new Date(budgetData.startDate).toISOString(),
      endDate: new Date(budgetData.endDate).toISOString(),
    };

    try {
      if (editingBudget) {
        await dispatch(editBudget({ 
          id: editingBudget._id, 
          budgetData: formattedData 
        })).unwrap();
      } else {
        await dispatch(createBudget(formattedData)).unwrap();
      }
      navigate('/budgets');
    } catch (error) {
      console.error('Failed to save budget:', error);
      // Có thể thêm thông báo lỗi cho người dùng ở đây
    }
  };

  return (
    <div className="budget-form-container">
      <h2>{editingBudget ? 'Chỉnh sửa ngân sách' : 'Tạo ngân sách mới'}</h2>
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label>Số tiền:</label>
          <input
            type="number"
            name="amount"
            value={budgetData.amount}
            onChange={handleInputChange}
            required
            placeholder="Nhập số tiền"
          />
        </div>

        <div className="form-group">
          <label>Danh mục:</label>
          <div className="category-options">
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-option ${budgetData.category === category.id ? 'selected' : ''}`}
                onClick={() => setBudgetData(prev => ({ ...prev, category: category.id }))}
              >
                <FontAwesomeIcon icon={category.icon} />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Ngày bắt đầu:</label>
          <input
            type="date"
            name="startDate"
            value={budgetData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ngày kết thúc:</label>
          <input
            type="date"
            name="endDate"
            value={budgetData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ghi chú:</label>
          <textarea
            name="note"
            value={budgetData.note}
            onChange={handleInputChange}
            placeholder="Thêm ghi chú (không bắt buộc)"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/budgets')} className="cancel-button">
            Hủy
          </button>
          <button type="submit" className="submit-button">
            {editingBudget ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;