import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchBudgets, removeBudget } from '../../features/budgetSlice';
import './BudgetList.css';

const BudgetList = () => {
  const { budgets, isLoading, isError, message } = useSelector((state) => state.budgets);
  const transactions = useSelector((state) => state.transactions.transactions);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [remainingDays, setRemainingDays] = useState(0);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  useEffect(() => {
    const updateRemainingDays = () => {
      const now = new Date();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const days = Math.ceil((lastDay - now) / (1000 * 60 * 60 * 24));
      setRemainingDays(days);
    };

    // Update immediately
    updateRemainingDays();

    // Update every minute
    const interval = setInterval(updateRemainingDays, 60000);

    return () => clearInterval(interval);
  }, []);

  const calculateRemainingBudget = (budget) => {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
  
    // Lọc các giao dịch chi tiêu theo danh mục và thời gian
    const categoryTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.category === budget.category &&
        transaction.amount < 0 &&  // Chỉ lấy giao dịch chi tiêu (số âm)
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });
  
    // Tính tổng chi tiêu (đã là số âm)
    const totalSpent = categoryTransactions.reduce((sum, transaction) => 
      sum + Math.abs(transaction.amount), 0);
  
    // Trả về số dư ngân sách còn lại
    return budget.amount - totalSpent;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food':
      case 'Ăn uống':
        return 'utensils';
      case 'transport':
      case 'Di chuyển':
        return 'bus';
      case 'Mua sắm':
      case 'shopping':
        return 'shopping-bag';
      case 'Hóa đơn':
        return 'file-invoice-dollar';
      case 'Giải trí':
      case 'entertainment':
        return 'gamepad';
      case 'Sức khỏe':
        return 'heartbeat';
      case 'Giáo dục':
        return 'graduation-cap';
      default:
        return 'ellipsis-h';
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'food':
      case 'Ăn uống':
        return 'Ăn uống';
      case 'transport':
      case 'Di chuyển':
        return 'Di chuyển';
      case 'shopping':
      case 'Mua sắm':
        return 'Mua sắm';
      case 'Hóa đơn':
        return 'Hóa đơn';
      case 'entertainment':
      case 'Giải trí':
        return 'Giải trí';
      case 'Sức khỏe':
        return 'Sức khỏe';
      case 'Giáo dục':
        return 'Giáo dục';
      default:
        return 'Khác';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleEdit = (budget) => {
    navigate('/edit-budget', { state: { budget } });
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) {
      try {
        await dispatch(removeBudget(budgetId)).unwrap();
      } catch (error) {
        console.error('Failed to delete budget:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (isError) {
    return <div className="error">Lỗi: {message}</div>;
  }

  return (
    <div className="budget-list-container">
      <div className="budget-list-header">
        <h2>Danh sách ngân sách</h2>
        <div className="header-right">
          <p className="remaining-days">Còn lại {remainingDays} ngày trong tháng</p>
          <button 
            className="add-budget-button"
            onClick={() => navigate('/create-budget')}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div className="budget-grid">
        {budgets.map((budget) => {
          const remainingAmount = calculateRemainingBudget(budget);
          const isOverBudget = remainingAmount < 0;
          const percentageUsed = ((budget.amount - remainingAmount) / budget.amount) * 100;

          return (
            <div key={budget._id} className="budget-card">
              <div className="budget-icon">
                <FontAwesomeIcon icon={getCategoryIcon(budget.category)} />
              </div>
              <div className="budget-info">
                <h3>{getCategoryName(budget.category)}</h3>
                <p className="budget-amount">{formatAmount(budget.amount)}</p>
                <p className={`remaining-amount ${isOverBudget ? 'over-budget' : ''}`}>
                  {isOverBudget ? 'Vượt ngân sách: ' : 'Còn lại: '}
                  {formatAmount(Math.abs(remainingAmount))}
                </p>
                <div className="budget-progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.min(percentageUsed, 100)}%`,
                      backgroundColor: percentageUsed > 100 ? '#ff4444' : '#4CAF50'
                    }}
                  />
                </div>
                <div className="budget-percentage">
                  {percentageUsed.toFixed(1)}% đã sử dụng
                </div>
                {budget.note && (
                  <div className="budget-note-tooltip">
                    {budget.note}
                  </div>
                )}
                <div className="budget-dates">
                  <span>{formatDate(budget.startDate)}</span>
                  <span> - </span>
                  <span>{formatDate(budget.endDate)}</span>
                </div>
              </div>
              <div className="budget-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEdit(budget)}
                  title="Chỉnh sửa"
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(budget._id)}
                  title="Xóa"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetList;