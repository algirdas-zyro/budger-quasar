export const BUDGER_ID = 'BUDGER_ID';
export const BUDGER_EXPENSES = 'BUDGER_EXPENSES';
export const HAS_EXPENSES = 'HAS_EXPENSES';

export default {
  [BUDGER_ID]: (state) => state.id,
  [BUDGER_EXPENSES]: (state) => state.expenses,
  [HAS_EXPENSES]: (state) => !!state.expenses.length,
};
