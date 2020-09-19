import {
  SET_BUDGER,
  SET_EXPENSE_CATEGORY,
} from './mutations';

export const INITIALIZE = 'INITIALIZE';
export const UPDATE_ENTRY_CATEGORY = 'UPDATE_ENTRY_CATEGORY';

export default {
  [INITIALIZE]({ commit }, { id, expenses, categories }) {
    commit(SET_BUDGER, { id, expenses, categories });
  },
  [UPDATE_ENTRY_CATEGORY]({ commit }, {category, expenseId}) {
    commit(SET_EXPENSE_CATEGORY, {category, expenseId});
  }
};
