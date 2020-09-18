<template>
  <q-page class="create">
    <q-table
      title="User Categories"
      row-key="id"
      :data="categoriesData"
      :columns="categoriesColumns"
    >
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
import { LOG_IN } from 'src/store/user/actions';
import { HOME_PATH } from 'src/router/routes';

import useApi, { CATEGORIES_API } from 'src/use/useApi'
import { USER_CATEGORIES } from 'src/store/user/getters';

const { mapActions: userActions, mapGetters: userGetters } = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      title: '',
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
    categoriesData: ({ userCategories }) => userCategories.map(({
      id,
      title,
    }) => ({
      id,
      title,
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
    ...userActions({ logIn: LOG_IN }),
    async onSubmit () {
      await this.callApi(CATEGORIES_API, {
        method: 'POST',
        data: {
          title: this.title
        }
      })
      if (this.result) {
        console.log('sccess')
        // this.logIn(this.result)
        // this.$router.push({ path: HOME_PATH })
      }
    },
  }
}
</script>
