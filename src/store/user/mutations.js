export const SET_USER = 'SET_USER';
export const SET_TOKEN = 'SET_TOKEN';

export default {
  [SET_USER](state, { id, email, budgers }) {
    state.id = id;
    state.email = email;
    state.budgers = budgers;
  },
  [SET_TOKEN](state, payload) {
    state.token = payload;
  }
};
