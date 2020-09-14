import {
  USER_ID,
  USER_EMAIL,
  JWT_TOKEN,
  IS_AUTHENTICATED,
} from './getter-types'

export default {
  [USER_ID]: (state) => state.id ?? null,
  [USER_EMAIL]: (state) => state.email ?? null,
  [JWT_TOKEN]: (state) => state.token ?? null,
  [IS_AUTHENTICATED]: (state) => !!state.token?.length ?? false,
};
