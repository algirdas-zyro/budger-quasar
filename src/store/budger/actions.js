import { SET_BUDGER } from './mutations';

export const INITIALIZE = 'INITIALIZE';

export default {
  [INITIALIZE]({ commit }, { id, expenses, categories }) {
    commit(SET_BUDGER, { id, expenses, categories });
  }
};
