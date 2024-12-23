import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar, setUserData } from '../../features/userSlice';
import './OverAll.css';
import { PieChart } from 'react-minimal-pie-chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const OverAll = () => {
  const dispatch = useDispatch();
  const avatar = useSelector((state) => state.user.avatar);
  const userData = useSelector((state) => state.user.userData);
  const fileInputRef = useRef(null);

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const transactions = useSelector((state) => state.transactions.transactions);

  // Filter transactions based on date range
  const filteredTransactions = transactions.filter(transaction => {
    if (!dateRange.startDate || !dateRange.endDate) return true;
    const transactionDate = new Date(transaction.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  // Calculate total income and expenses
  const { totalIncome, totalExpense } = filteredTransactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.totalIncome += parseFloat(transaction.amount);
    } else {
      acc.totalExpense += Math.abs(parseFloat(transaction.amount));
    }
    return acc;
  }, { totalIncome: 0, totalExpense: 0 });

  // Calculate spending by category
  const spendingByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(parseFloat(transaction.amount));
      return acc;
    }, {});

  // Convert spending data for pie chart
  const colors = ['#E38627', '#C13C37', '#6A2135', '#47B39C', '#6A4C93'];
  const defaultSpendingData = [
    { title: 'Ăn uống', value: 0, color: '#E38627' },
    { title: 'Di chuyển', value: 0, color: '#C13C37' },
    { title: 'Mua sắm', value: 0, color: '#6A2135' },
    { title: 'Giải trí', value: 0, color: '#47B39C' },
  ];

  let spendingData = Object.entries(spendingByCategory).map(([category, value], index) => ({
    title: category,
    value: parseFloat(value),
    color: colors[index % colors.length]
  }));

  // If no spending data, use default data
  if (spendingData.length === 0) {
    spendingData = defaultSpendingData;
  }

  // Debug log
  console.log('Spending Data:', spendingData);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(setAvatar(e.target.result));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setUserData({
      ...userData,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="overall-container">
      {/* User Information Card */}
      <div className="user-info-card">
        <div className="avatar-container" onClick={handleAvatarClick}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {avatar ? (
            <img src={avatar} alt="User avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <span>+</span>
            </div>
          )}
        </div>
        <div className="user-details">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={userData.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Tuổi"
            value={userData.age}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="birthdate"
            placeholder="Ngày sinh"
            value={userData.birthdate}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={userData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Transaction Summary Card */}
      <div className="transaction-summary-card">
        <div className="summary-box">
          <h3>Tổng thu</h3>
          <p className="amount income">{totalIncome.toLocaleString('vi-VN')} ₫</p>
        </div>
        <div className="summary-box">
          <h3>Tổng chi</h3>
          <p className="amount expense">{totalExpense.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>

      {/* Spending Chart Card */}
      <div className="spending-chart-card">
        <div className="date-range-selector">
          <div className="date-input">
            <label>Từ ngày:</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="date-input">
            <label>Đến ngày:</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        {spendingData.length > 0 && (
          <div className="chart-container">
            <div className="chart-box pie-chart-box">
              <div className="chart-title">Phân Bổ Chi Tiêu</div>
              <PieChart
                data={spendingData.filter(item => item.value > 0)}
                animate
                animationDuration={500}
                radius={45}
                lineWidth={60}
                startAngle={0}
                lengthAngle={360}
                paddingAngle={3}
                segmentsStyle={(index) => ({
                  transition: 'all .3s',
                  strokeWidth: 20
                })}
                label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                labelStyle={(index) => ({
                  fill: '#ffffff',
                  fontSize: '6px',
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold'
                })}
                labelPosition={70}
              />
              <div className="pie-chart-legend">
                {spendingData.filter(item => item.value > 0).map((data, index) => (
                  <div key={index} className="pie-legend-item">
                    <span 
                      className="color-box" 
                      style={{ backgroundColor: data.color }}
                    ></span>
                    <span>{data.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-box bar-chart-box">
              <div className="chart-title">Chi Tiết Chi Tiêu</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={spendingData.filter(item => item.value > 0)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="title" 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#FF9AA2" 
                    barSize={30}
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverAll;