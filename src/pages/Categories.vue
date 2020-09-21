<template>
  <q-page class="create">
    <q-table
      title="User Categories"
      :data="categoriesData"
      :columns="categoriesColumns"
      row-key="id"
    >

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
          <q-th auto-width />
          <q-th auto-width />
          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-form @submit="handleTitleUpdateSubmit(props.row.index)">
              <q-input
                bottom-slots
                v-model="props.row.title"
                label="new mapping"
                :ref="`titleInput${props.row.id}`"
                :readonly="props.row.readonly"
              >
                <template v-slot:append>
                  <q-btn
                    dense
                    flat
                    :icon="props.row.readonly ? 'edit' : 'send'"
                    type="submit"
                    color="primary"
                    @click="handleTitleBtnClick(props.row.index)"
                  />
                </template>
              </q-input>
            </q-form>
          </q-td>

          <q-td style="white-space:normal">
            <q-chip
              removable
              v-for="(mapping, index) in props.row.mappings"
              :key="index"
              @remove="handleRemoveMappingClick(props.row.id, mapping)"
              :label="mapping"
            />
          </q-td>

          <q-td auto-width>
            <q-form @submit="handlMappingsSubmit(props.row.id, props.row.index)">

              <div class="create">
                <q-input
                  bottom-slots
                  v-model="props.row.newMappingInput"
                  label="new mapping"
                >
                  <template v-slot:append>
                    <q-btn
                      dense
                      flat
                      icon="send"
                      type="submit"
                      color="primary"
                      @click="handlMappingsSubmit(props.row.id, props.row.index)"
                    />
                  </template>
                </q-input>
              </div>
            </q-form>
          </q-td>

          <q-td auto-width>
            <q-btn
              size="sm"
              round
              dense
              icon="delete"
              @click="handleDeleteClick(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-form
      @submit="handleSubmit"
      class="q-gutter-md"
    >
      <q-input
        filled
        label="Title"
        v-model="title"
      />
      <q-btn
        label="Create"
        type="submit"
        color="primary"
      />
    </q-form>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { USER } from 'src/store/namespace';
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  CREATE_CATEGORY_MAPPING,
  DELETE_CATEGORY_MAPPING,
} from 'src/store/user/actions';

import { HOME_PATH } from 'src/router/routes';

import useApi, { CATEGORIES_API } from 'src/use/useApi'
import { USER_CATEGORIES } from 'src/store/user/getters';

const {
  mapActions: userActions,
  mapGetters: userGetters
} = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      title: '',
      categoriesData: [],
    }
  },
  watch: {
    // Whenever the movie prop changes, fetch new data
    userCategories: {
      // Will fire as soon as the component is created
      immediate: true,
      handler (userCategories, previousCategories) {
        if (userCategories !== previousCategories) {
          console.log('hit?')
          this.categoriesData = userCategories?.map(({
            id,
            title,
            mappings,
          }, index) => ({
            id,
            index,
            title,
            mappings,
            readonly: true,
            newMappingInput: ''
          }))
        }
      }
    },
  },
  computed: {
    ...userGetters({
      userCategories: USER_CATEGORIES
    }),
    categoriesColumns: () => ([{
      field: ({ title }) => title,
      label: 'Title',
      name: 'title',
      align: 'left'
    }])
  },
  methods: {
    ...userActions({
      createCategory: CREATE_CATEGORY,
      updateCategory: UPDATE_CATEGORY,
      deleteCategory: DELETE_CATEGORY,
      createCategoryMapping: CREATE_CATEGORY_MAPPING,
      deleteCategoryMapping: DELETE_CATEGORY_MAPPING,
    }),
    handleDeleteClick (id) {
      this.deleteCategory(id)
    },
    handleRemoveMappingClick (categoryId, mapping) {
      this.deleteCategoryMapping({ categoryId, mapping })
    },
    handlMappingsSubmit (categoryId, index) {
      const { newMappingInput } = this.categoriesData[index]
      this.createCategoryMapping({ categoryId, mapping: newMappingInput })
      this.categoriesData[index].newMappingInput = ''
    },
    handleTitleBtnClick (index) {
      const category = this.categoriesData[index];
      if (category.readonly) {
        this.categoriesData[index].readonly = false;
        this.$refs[`titleInput${category.id}`].focus()
      } else {
        this.handleTitleUpdateSubmit(index);
      }

    },
    handleTitleUpdateSubmit (index) {
      const category = this.categoriesData[index];
      this.categoriesData.readonly = true;
      delete category.index;
      this.updateCategory(category);
    },
    async handleSubmit () {
      this.createCategory(this.title)
    },
  }
}
</script>
