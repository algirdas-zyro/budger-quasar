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
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="accent"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr
          v-show="props.expand"
          :props="props"
        >
          <q-td colspan="100%">
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
            <div
              class="inputs"
              v-if="props.row.mappings"
            >
              <div
                class="mappins"
                v-for="(mapping, index) in props.row.mappings"
                :key="index"
              >
                <q-input :value="mapping" />
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-form
      @submit="onSubmit"
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
import { CREATE_CATEGORY, CREATE_CATEGORY_MAPPING } from 'src/store/user/actions';

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
        field: ({ id }) => id,
        label: 'ID',
        name: 'id',
      },
      {
        field: ({ title }) => title,
        label: 'Title',
        name: 'title',
      },
    ])
  },
  methods: {
    ...userActions({
      createCategory: CREATE_CATEGORY,
      createCategoryMapping: CREATE_CATEGORY_MAPPING,
    }),
    onMappingsSubmit (categoryId) {
      this.createCategoryMapping({ categoryId, mapping: this.newMappingInput })
      this.newMappingInput = ''
    },
    async onSubmit () {
      this.createCategory(this.title)
      // await this.callApi(CATEGORIES_API, {
      //   method: 'POST',
      //   data: {
      //     title: this.title
      //   }
      // })
      // if (this.result) {
      //   console.log('sccess')
      // }
    },
  }
}
</script>
