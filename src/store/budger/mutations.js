export const SET_BUDGER = 'SET_BUDGER';

export default {
  [SET_BUDGER](state, { id, expenses }) {
    state.id = id;
    state.expenses = expenses;
  }
};
