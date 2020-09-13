import { LOG_IN } from './action-types';
import { SET_USER_NAME } from './mutation-types';

export default {
  [LOG_IN](
    { state, getters, rootState, rootGetters, dispatch, commit },
    payload
  ) {
    commit(SET_USER_NAME, payload);
  }
};
