import {
  LOG_IN,
  LOG_OUT,
} from './action-types';

import {
  SET_USER,
  SET_TOKEN,
} from './mutation-types';

export default {
  [LOG_IN]({ commit }, {jwt, user}) {
    commit(SET_TOKEN, jwt);
    commit(SET_USER, { ...user });
  },
  [LOG_OUT]({ commit }) {
    commit(SET_TOKEN, null);
    commit(SET_USER, {});
  }
};
