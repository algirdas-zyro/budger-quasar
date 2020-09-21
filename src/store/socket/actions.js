import io from 'socket.io-client';

import { BUDGER, USER } from 'src/store/namespace'
import { SET_EXPENSE_CATEGORY } from 'src/store/budger/mutations'
import {
  SET_CATEGORY,
  UPDATE_CATEGORY,
  UNSET_CATEGORY,
  SET_CATEGORY_MAPPING,
  UNSET_CATEGORY_MAPPING,
 } from 'src/store/user/mutations'

const socket = io(process.env.API_URL);

export const CLIENT = 'client'
export const SERVER = 'server'

export const INITIALIZE = 'INITIALIZE';
export const EMIT = 'EMIT';

export const CATEGORY_CREATED = 'CATEGORY_CREATED';
export const CATEGORY_UPDATED = 'CATEGORY_UPDATED';
export const CATEGORY_DELETED = 'CATEGORY_DELETED';
export const CATEGORY_MAPPING_CREATED = 'CATEGORY_MAPPING_CREATED';
export const EXPENSE_CATEGORY_CREATED = 'EXPENSE_CATEGORY_CREATED';
export const CATEGORY_MAPPING_DELETED = 'CATEGORY_MAPPING_DELETED';

export default {
  [INITIALIZE]({ commit }) {
    socket.on(`${SERVER}:${CATEGORY_CREATED}`, (data) => {
      commit(`${USER}/${SET_CATEGORY}`, data, { root: true })
    });
    socket.on(`${SERVER}:${CATEGORY_UPDATED}`, (data) => {
      commit(`${USER}/${UPDATE_CATEGORY}`, data, { root: true })
    });
    socket.on(`${SERVER}:${CATEGORY_DELETED}`, (data) => {
      commit(`${USER}/${UNSET_CATEGORY}`, data, { root: true })
    });
    socket.on(`${SERVER}:${EXPENSE_CATEGORY_CREATED}`, (data) => {
      commit(`${BUDGER}/${SET_EXPENSE_CATEGORY}`, data, { root: true })
    });
    socket.on(`${SERVER}:${CATEGORY_MAPPING_CREATED}`, (data) => {
      commit(`${USER}/${SET_CATEGORY_MAPPING}`, data, { root: true })
    });
    socket.on(`${SERVER}:${CATEGORY_MAPPING_DELETED}`, (data) => {
      commit(`${USER}/${UNSET_CATEGORY_MAPPING}`, data, { root: true })
    });
  },
  [EMIT](store, { event, data }) {
    /// attach tokens here
    console.log(`${CLIENT}:${event}`)
    socket.emit(`${CLIENT}:${event}`, data);
  },
};
