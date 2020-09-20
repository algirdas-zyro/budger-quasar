import axios from 'axios';

import { BUDGER, SOCKET } from 'src/store/namespace';

import { EMIT } from 'src/store/socket/actions'
import { INITIALIZE } from 'src/store/budger/actions';
import { BUDGER_ID } from 'src/store/budger/getters';
import {
  SET_USER,
  SET_TOKEN,
  SET_CATEGORY,
  REMOVE_CATEGORY,
  SET_CATEGORY_MAPPING,
} from 'src/store/user/mutations';

import { JWT_TOKEN, USER_ID } from './getters';

let jwtInterceptor;

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const CHECK_LOCALSTORAGE = 'CHECK_LOCALSTORAGE';
export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const CREATE_CATEGORY_MAPPING = 'CREATE_CATEGORY_MAPPING';

export const JWT_STORAGE_KEY = 'jwt'
export const USER_STORAGE_KEY = 'user'

export default {
  [LOG_IN]({ getters, dispatch, commit }, { jwt, user, remember }) {

    if (!getters[JWT_TOKEN]) {
      jwtInterceptor = axios.interceptors.request.use((config) => ({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${jwt}`
        },
      }))
    }

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

    axios.interceptors.request.eject(jwtInterceptor);

  },

  async [CHECK_LOCALSTORAGE]({ dispatch }) {
    const jwt = localStorage.getItem(JWT_STORAGE_KEY)
    const user = localStorage.getItem(USER_STORAGE_KEY)

    if (!jwt || !user) return;

    dispatch(LOG_IN, {
      jwt: JSON.parse(jwt),
      user: JSON.parse(user)
    })

    // get updated data and log in again
    try {
      const { data } = await axios('users/me')
      dispatch(LOG_IN, { jwt, user: data })
    } catch (err) {
      console.error(err) // fail miserably
    }
  },

  [CREATE_CATEGORY_MAPPING]({ state, dispatch }, { categoryId, mapping }) {
    dispatch(`${SOCKET}/${EMIT}`,
      { event: SET_CATEGORY_MAPPING, data: { categoryId, mapping } },
      { root: true }
    );
  },

  [CREATE_CATEGORY]({ getters, rootGetters, dispatch }, title) {
    const category = {
      title,
      userId: getters[USER_ID],
      budgerId: rootGetters[`${BUDGER}/${BUDGER_ID}`]
    }
    dispatch(`${SOCKET}/${EMIT}`,
      { event: SET_CATEGORY, data: category },
      { root: true }
    );
  },

  [DELETE_CATEGORY]({ dispatch }, id) {
    dispatch(`${SOCKET}/${EMIT}`,
      { event: REMOVE_CATEGORY, data: id },
      { root: true }
    );
  }
};
