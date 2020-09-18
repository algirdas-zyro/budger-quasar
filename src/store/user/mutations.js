export const SET_USER = 'SET_USER';
export const SET_TOKEN = 'SET_TOKEN';

export default {
  [SET_USER](state, { id, email, budgers, categories }) {
    state.id = id;
    state.email = email;
    state.budgers = budgers;
    state.categories = categories;
  },
  [SET_TOKEN](state, payload) {
    state.token = payload;
  }
};
