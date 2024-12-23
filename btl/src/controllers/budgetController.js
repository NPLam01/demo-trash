const Budget = require('../models/Budget');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Public
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ date: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Public
const createBudget = async (req, res) => {
  try {
    const { category, amount, startDate, endDate, note } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu' });
    }

    const budget = new Budget({
      category,
      amount,
      startDate,
      endDate,
      note
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Public
const updateBudget = async (req, res) => {
  try {
    const { category, amount, startDate, endDate, note } = req.body;

    // Validate dates if they are being updated
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu' });
      }
    }

    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      { category, amount, startDate, endDate, note },
      { new: true }
    );

    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Public
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
    }

    await budget.deleteOne();
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};
