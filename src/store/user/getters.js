import { GET_USER_DATA } from './getter-types';

export default {
  [GET_USER_DATA](state) {
    return `${state.name} with Surname`;
  }
};
