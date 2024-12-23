const UserRouter = require("./UserRoute")
const ExpenseRoute = require("./ExpenseRoute")
const MonthlyLimitRoute = require("./MonthlyLimitRoute")
const BudgetRoute = require("./BudgetRoute")

const routes = (app) =>{
    console.log('Mounting routes...');
    
    app.use('/api/user', UserRouter);
    console.log('User routes mounted at /api/user');
    console.log('Available user routes:', UserRouter.stack.map(r => r.route?.path).filter(Boolean));
    
    app.use('/api/expense', ExpenseRoute);
    app.use('/api/monthlyLimit', MonthlyLimitRoute);
    app.use('/api/budgets', BudgetRoute);
}

module.exports = routes