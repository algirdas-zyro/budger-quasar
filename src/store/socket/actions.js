import io from 'socket.io-client';

import { BUDGER, USER } from 'src/store/namespace'
import { SET_EXPENSE_CATEGORY } from 'src/store/budger/mutations'
import { SET_CATEGORY_MAPPING, SET_CATEGORY } from 'src/store/user/mutations'

const socket = io(process.env.API_URL);

export const CLIENT = 'client'
export const SERVER = 'server'

export const INITIALIZE = 'INITIALIZE';
export const EMIT = 'EMIT';

// export const EMIT_SET_EXPENSE_CATEGORY = 'EMIT_SET_EXPENSE_CATEGORY'

export default {
  [INITIALIZE]({ commit }) {
    socket.on(`${SERVER}:${SET_EXPENSE_CATEGORY}`, (data) => {
      commit(`${BUDGER}/${SET_EXPENSE_CATEGORY}`, data, { root: true })
    })
    socket.on(`${SERVER}:${SET_CATEGORY_MAPPING}`, (data) => {
      commit(`${USER}/${SET_CATEGORY_MAPPING}`, data, { root: true })
    })
    socket.on(`${SERVER}:${SET_CATEGORY}`, (data) => {
      commit(`${USER}/${SET_CATEGORY}`, data, { root: true })
    })
  },
  [EMIT](store, { event, data }) {
    /// attach tokens here
    console.log(`${CLIENT}:${event}`)
    socket.emit(`${CLIENT}:${event}`, data);
  },
  // [EMIT_SET_EXPENSE_CATEGORY](store, { event, data }) {
  //   socket.emit(`${CLIENT}:${SET_EXPENSE_CATEGORY}`, data);
  // },
};
