import { SET_USER_NAME } from "./mutation-types";

export default {
  [SET_USER_NAME](state, payload) {
    state.name = payload;
  }
};
