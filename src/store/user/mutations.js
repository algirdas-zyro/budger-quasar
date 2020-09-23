export const SET_USER = 'SET_USER';
export const SET_TOKEN = 'SET_TOKEN';

export const APPEND_BUDGER = 'APPEND_BUDGER';
export const SET_BUDGER = 'SET_BUDGER';
export const SPLICE_BUDGER = 'SPLICE_BUDGER';
export const APPEND_BUDGER_COLLABORATOR = 'APPEND_BUDGER_COLLABORATOR';
export const SPLICE_BUDGER_COLLABORATOR = 'SPLICE_BUDGER_COLLABORATOR';
export const SPLICE_BUDGER_INVITATION = 'SPLICE_BUDGER_INVITATION';


export const APPEND_CATEGORY = 'APPEND_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const SPLICE_CATEGORY = 'SPLICE_CATEGORY';
export const APPEND_CATEGORY_MAPPING = 'APPEND_CATEGORY_MAPPING';
export const SPLICE_CATEGORY_MAPPING = 'SPLICE_CATEGORY_MAPPING';

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
  [APPEND_BUDGER](state, budger) {
    state.budgers = [...state.budgers, budger]
  },
  [SET_BUDGER](state, updatedBudger) {
    state.budgers = state.budgers.map((budger) => budger.id === updatedBudger.id ? updatedBudger : budger)
    // TODO: update main_budger if it's main budger update
  },
  [SPLICE_BUDGER](state, id) {
    state.budgers = state.budgers.filter((budger)=> budger.id !==id)
  },
  [APPEND_CATEGORY](state, category) {
    state.categories = [...state.categories, category]
  },
  [UPDATE_CATEGORY](state, updatedCategory) {
    state.categories = state.categories.map((category) => {
      return category.id === updatedCategory.id ? updatedCategory : category
    })
  },
  [SPLICE_CATEGORY](state, id) {
    state.categories = state.categories.filter((category)=> category.id !==id)
  },
  [APPEND_CATEGORY_MAPPING](state, { categoryId, mapping }) {
    state.categories = state.categories.map((category) => {
      if (category.id === categoryId) category.mappings = [mapping, ...category.mappings]
      return category
    })
  },
  [SPLICE_CATEGORY_MAPPING](state, { categoryId, mapping }) {
    state.categories = state.categories.map((category) => {
      if (category.id === categoryId) {
        category.mappings = category.mappings.filter((m) => m !== mapping)
      }
      return category
    })
  },
};
