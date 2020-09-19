export const BUDGER_ID = 'BUDGER_ID';
export const BUDGER_EXPENSES = 'BUDGER_EXPENSES';
export const BUDGER_CATEGORIES = 'BUDGER_CATEGORIES';

export default {
  [BUDGER_ID]: (state) => state.id,
  [BUDGER_EXPENSES]: (state) => state.expenses,
  [BUDGER_CATEGORIES]: (state) => state.categories,
};
