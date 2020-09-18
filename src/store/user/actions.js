import { BUDGER } from 'src/store/namespace';
import { INITIALIZE } from 'src/store/budger/actions';
import { SET_USER, SET_TOKEN } from 'src/store/user/mutations';

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const CHECK_LOCALSTORAGE = 'CHECK_LOCALSTORAGE';

export const JWT_STORAGE_KEY = 'jwt'
export const USER_STORAGE_KEY = 'user'

export default {
  [LOG_IN]({ dispatch, commit }, { jwt, user, remember }) {
    commit(SET_TOKEN, jwt);
    commit(SET_USER, user);

    if (remember) {
      localStorage.setItem(JWT_STORAGE_KEY, JSON.stringify(jwt))
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    }

    if (user.main_budger) {
      const { id, expenses, categories } = user.main_budger
      dispatch(`${BUDGER}/${INITIALIZE}`, { id, expenses, categories }, { root: true });
    }
  },
  [LOG_OUT]({ commit }) {
    commit(SET_TOKEN, null);
    commit(SET_USER, {});

    localStorage.removeItem(JWT_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
  },
  [CHECK_LOCALSTORAGE]({ dispatch }) {
    const jwt = localStorage.getItem(JWT_STORAGE_KEY)
    const user = localStorage.getItem(USER_STORAGE_KEY)

    if (jwt && user) {
      dispatch(LOG_IN, {
        jwt: JSON.parse(jwt),
        user: JSON.parse(user)
      })
    }
  }
};
