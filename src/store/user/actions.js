import axios from 'axios';

import { BUDGER, SOCKET } from 'src/store/namespace';

import { EMIT } from 'src/store/socket/actions'
import { INITIALIZE } from 'src/store/budger/actions';

import { BUDGER_ID } from 'src/store/budger/getters';
import {
  SET_USER,
  SET_TOKEN,
  APPEND_BUDGER,
  SET_BUDGER,
  SPLICE_BUDGER,
  APPEND_BUDGER_COLLABORATOR,
  SPLICE_BUDGER_COLLABORATOR,
} from 'src/store/user/mutations';

import { JWT_TOKEN, USER_ID } from './getters';

let jwtInterceptor;

export const JWT_STORAGE_KEY = 'jwt'
export const USER_STORAGE_KEY = 'user'
export const BUDEGRS_API = 'budgers'

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const CHECK_LOCALSTORAGE = 'CHECK_LOCALSTORAGE';

export const CREATE_BUDGER = 'CREATE_BUDGER';
export const UPDATE_BUDGER = 'UPDATE_BUDGER';
export const DELETE_BUDGER = 'DELETE_BUDGER';
export const CREATE_BUDGER_COLLABORATOR = 'CREATE_BUDGER_COLLABORATOR';
export const DELETE_BUDGER_COLLABORATOR = 'DELETE_BUDGER_COLLABORATOR';

export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const CREATE_CATEGORY_MAPPING = 'CREATE_CATEGORY_MAPPING';
export const DELETE_CATEGORY_MAPPING = 'DELETE_CATEGORY_MAPPING';

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

  async [CREATE_BUDGER]({ commit }, title) {
    const { data } = await axios.post('budgers', { title });
    commit(APPEND_BUDGER, data);
  },

  async [UPDATE_BUDGER]({ commit }, budger) {
    const { data } = await axios.put(`budgers/${budger.id}`, budger);
    commit(SET_BUDGER, data);
  },

  async [DELETE_BUDGER]({ commit }, id) {
    const { data } = await axios.delete(`budgers/${id}`);
    commit(SPLICE_BUDGER, data.id);
  },

  [CREATE_BUDGER_COLLABORATOR]({ getters, rootGetters, dispatch }, title) {
    console.log(title)
  },

  [DELETE_BUDGER_COLLABORATOR]({ getters, rootGetters, dispatch }, title) {
    console.log(title)
  },

  [CREATE_CATEGORY]({ getters, rootGetters, dispatch }, title) {
    const category = {
      title,
      userId: getters[USER_ID],
      budgerId: rootGetters[`${BUDGER}/${BUDGER_ID}`]
    }
    dispatch(`${SOCKET}/${EMIT}`,
      { event: CREATE_CATEGORY, data: category },
      { root: true }
    );
  },

  [UPDATE_CATEGORY]({ dispatch }, category ) {
    dispatch(`${SOCKET}/${EMIT}`,
      { event: UPDATE_CATEGORY, data: category },
      { root: true }
    );
  },

  [DELETE_CATEGORY]({ dispatch }, id) {
    dispatch(`${SOCKET}/${EMIT}`,
      { event: DELETE_CATEGORY, data: id },
      { root: true }
    );
  },

  [CREATE_CATEGORY_MAPPING]({ dispatch }, { categoryId, mapping }) {
    dispatch(`${SOCKET}/${EMIT}`,
      { event: CREATE_CATEGORY_MAPPING, data: { categoryId, mapping } },
      { root: true }
    );
  },

  [DELETE_CATEGORY_MAPPING]({ dispatch }, { categoryId, mapping }) {
    console.log({categoryId, mapping})
    dispatch(`${SOCKET}/${EMIT}`,
      { event: DELETE_CATEGORY_MAPPING, data: { categoryId, mapping } },
      { root: true }
    );
  },
};
