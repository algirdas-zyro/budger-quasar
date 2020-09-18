export const USER_ID = 'USER_ID';
export const USER_EMAIL = 'USER_EMAIL';
export const USER_BUDGERS = 'USER_BUDGERS';
export const USER_CATEGORIES = 'USER_CATEGORIES';
export const JWT_TOKEN = 'JWT_TOKEN';
export const IS_AUTHENTICATED = 'IS_AUTHENTICATED';

export default {
  [USER_ID]: (state) => state.id,
  [USER_EMAIL]: (state) => state.email,
  [USER_BUDGERS]: (state) => state.budgers,
  [USER_CATEGORIES]: (state) => state.categories,
  [JWT_TOKEN]: (state) => state.token,
  [IS_AUTHENTICATED]: (state) => !!state.token?.length ?? false,
};
