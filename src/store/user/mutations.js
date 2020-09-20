export const SET_USER = 'SET_USER';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_CATEGORY = 'SET_CATEGORY';
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY';
export const SET_CATEGORY_MAPPING = 'SET_CATEGORY_MAPPING';
export const REMOVE_CATEGORY_MAPPING = 'REMOVE_CATEGORY_MAPPING';

export default {
  [SET_USER](state, { id, email, budgers, categories }) {
    state.id = id;
    state.email = email;
    state.budgers = budgers;
    state.categories = categories;
  },
  [SET_TOKEN](state, payload) {
    state.token = payload;
  },
  [SET_CATEGORY](state, category) {
    state.categories = [...state.categories, category]
  },
  [REMOVE_CATEGORY](state, id) {
    state.categories = state.categories.filter((category)=> category.id !==id)
  },
  [SET_CATEGORY_MAPPING](state, { categoryId, mapping }) {
    state.categories = state.categories.map((category) => {
      if (category.id === categoryId) category.mappings = [mapping, ...category.mappings]
      return category
    })
  },
  [REMOVE_CATEGORY_MAPPING](state, { categoryId, mapping }) {
    state.categories = state.categories.map((category) => {
      if (category.id === categoryId) {
        category.mappings = category.mappings.filter((m) => m !== mapping)
      }
      return category
    })
  },
};
