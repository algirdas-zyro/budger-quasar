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
            {{props.row.title}}
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
            <q-form @submit.prevent="onMappingsSubmit(props.row.id)">
              <div class="create">
                <q-input
                  label="new mapping"
                  v-model="newMappingInput"
                />
              </div>
              <q-btn
                label="SAVE"
                type="submit"
                color="primary"
                style="width:100%"
              />
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
  DELETE_CATEGORY,
  CREATE_CATEGORY_MAPPING,
  DELETE_CATEGORY_MAPPING,
} from 'src/store/user/actions';

import { HOME_PATH } from 'src/router/routes';

import useApi, { CATEGORIES_API } from 'src/use/useApi'
import { USER_CATEGORIES } from 'src/store/user/getters';

const { mapActions: userActions, mapGetters: userGetters } = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      title: '',
      newMappingInput: '',
    }
  },
  setup () {
    const {
      result,
      callApi
    } = useApi()

    return {
      result,
      callApi
    }
  },
  computed: {
    ...userGetters({
      userCategories: USER_CATEGORIES
    }),
    categoriesData: ({ userCategories }) => userCategories?.map(({
      id,
      title,
      mappings,
    }) => ({
      id,
      title,
      mappings,
    })),
    categoriesColumns: () => ([
      {
        field: ({ title }) => title,
        label: 'Title',
        name: 'title',
        align: 'left'
      }
    ])
  },
  methods: {
    ...userActions({
      createCategory: CREATE_CATEGORY,
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
    onMappingsSubmit (categoryId) {
      this.createCategoryMapping({ categoryId, mapping: this.newMappingInput })
      this.newMappingInput = ''
    },
    async handleSubmit () {
      this.createCategory(this.title)
    },
  }
}
</script>
