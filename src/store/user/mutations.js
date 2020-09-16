import {
  SET_USER,
  SET_TOKEN,
} from './mutation-types';

export default {
  [SET_USER](state, { id, email, ...user }) {
    console.log({user})
    state.id = id;
    state.email = email;
  },
  [SET_TOKEN](state, payload) {
    state.token = payload;
  }
};
