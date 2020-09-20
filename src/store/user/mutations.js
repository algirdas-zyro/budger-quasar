export const SET_USER = 'SET_USER';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_CATEGORY = 'SET_CATEGORY';
export const UNSET_CATEGORY = 'UNSET_CATEGORY';
export const SET_CATEGORY_MAPPING = 'SET_CATEGORY_MAPPING';
export const UNSET_CATEGORY_MAPPING = 'UNSET_CATEGORY_MAPPING';

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
  [UNSET_CATEGORY](state, id) {
    state.categories = state.categories.filter((category)=> category.id !==id)
  },
  [SET_CATEGORY_MAPPING](state, { categoryId, mapping }) {
    state.categories = state.categories.map((category) => {
      if (category.id === categoryId) category.mappings = [mapping, ...category.mappings]
      return category
    })
  },
  [UNSET_CATEGORY_MAPPING](state, { categoryId, mapping }) {
    state.categories = state.categories.map((category) => {
      if (category.id === categoryId) {
        category.mappings = category.mappings.filter((m) => m !== mapping)
      }
      return category
    })
  },
};
