export const SET_BUDGER = 'SET_BUDGER';
export const SET_EXPENSE_CATEGORY = 'SET_EXPENSE_CATEGORY';

export default {
  [SET_BUDGER](state, { id, expenses }) {
    state.id = id;
    state.expenses = expenses;
  },
  [SET_EXPENSE_CATEGORY](state, { category, expenseId }) {
    console.log({ category, expenseId })
    state.expenses = state.expenses.map((expense) => {
      if (expense.id === expenseId) expense.category = category
      return expense
    })
  }
};
