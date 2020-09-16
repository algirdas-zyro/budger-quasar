import {
  LOG_IN,
  LOG_OUT,
  CHECK_LOCALSTORAGE,
} from './action-types';

import {
  SET_USER,
  SET_TOKEN,
} from './mutation-types';

const JWT_STORAGE_KEY = 'jwt'
const USER_STORAGE_KEY = 'user'

export default {
  [CHECK_LOCALSTORAGE]({ dispatch }) {
    const jwt = localStorage.getItem(JWT_STORAGE_KEY)
    const user = localStorage.getItem(USER_STORAGE_KEY)

    if (jwt && user) {
      dispatch(LOG_IN, {
        jwt: JSON.parse(jwt),
        user: JSON.parse(user)
      })
    }
  },
  [LOG_IN]({ commit }, { jwt, user, remember }) {
    commit(SET_TOKEN, jwt);
    commit(SET_USER, user);

    if (remember) {
      localStorage.setItem(JWT_STORAGE_KEY, JSON.stringify(jwt))
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    }
  },
  [LOG_OUT]({ commit }) {
    commit(SET_TOKEN, null);
    commit(SET_USER, {});

    localStorage.removeItem(JWT_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
  }
};
