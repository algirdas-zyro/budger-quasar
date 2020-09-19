import io from 'socket.io-client';

import { BUDGER } from 'src/store/namespace'
import { SET_EXPENSE_CATEGORY } from 'src/store/budger/mutations'

const socket = io(process.env.API_URL);

export const CLIENT = 'client'
export const SERVER = 'server'

export const INITIALIZE = 'INITIALIZE';
export const EMIT = 'EMIT';

// export const EMIT_SET_EXPENSE_CATEGORY = 'EMIT_SET_EXPENSE_CATEGORY'

export default {
  [INITIALIZE]({ commit }) {
    socket.on(`${SERVER}:${SET_EXPENSE_CATEGORY}`, (data) => {
      console.log(data)
      commit(`${BUDGER}/${SET_EXPENSE_CATEGORY}`, data, { root: true })
    })
  },
  [EMIT](store, { event, data }) {
    /// attach tokens here
    socket.emit(`${CLIENT}:${event}`, data);
  },
  // [EMIT_SET_EXPENSE_CATEGORY](store, { event, data }) {
  //   socket.emit(`${CLIENT}:${SET_EXPENSE_CATEGORY}`, data);
  // },
};
