import { SOCKET } from 'src/store/namespace'
import { EMIT } from 'src/store/socket/actions'
import { SET_BUDGER, SET_EXPENSE_CATEGORY } from './mutations';

export const INITIALIZE = 'INITIALIZE';
export const UPDATE_ENTRY_CATEGORY = 'UPDATE_ENTRY_CATEGORY';

export default {
  [INITIALIZE]({ commit }, { id, expenses, categories }) {
    commit(SET_BUDGER, { id, expenses, categories });
  },
  [UPDATE_ENTRY_CATEGORY]({ state, dispatch }, { category, expenseId }) {
    const { id } = state; // budger id
    dispatch(`${SOCKET}/${EMIT}`,
      { event: SET_EXPENSE_CATEGORY, data: { id, category, expenseId } },
      { root: true }
    );
  }
};
