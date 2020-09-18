<template>
  <q-page class="flex flex-center">
    <div
      class="budgers"
      v-if="isAuthenticated"
    >
      <div
        class="expenses"
        v-if="hasExpenses"
      >
        <q-table
          title="Expenses"
          row-key="id"
          :dense="$q.screen.lt.md"
          :data="expensesData"
          :columns="expensesColumns"
        >
          <template v-slot:body-cell-category="props">
            <q-td :props="props">
              <q-select
                use-input
                dense
                label="Category"
                style="width: 250px"
                v-model="model"
                :options="options"
                @filter="filterFn"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-td>
          </template>
        </q-table>
        <div
          class="expense"
          v-for="({id, amount, reference, category }) in budgerExpenses"
          :key="id"
        >
          {{id}}
          {{amount}}
          {{reference}}
          {{category.title}}

        </div>
      </div>
      <div
        class="list"
        v-else-if="hasBudgers"
      >
        <div class="budgers">
          <div
            class="budger"
            v-for="({title, id}) in userBudgers"
            :key="id"
          >{{title}}</div>
        </div>
      </div>
      <div
        class="create"
        v-else
      >
        <router-link
          :to="CREATE_PATH"
          v-slot="{ href, navigate, isActive, isExactActive }"
        >
          <q-btn
            type="a"
            color="primary"
            label="CREATE"
            :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
            :href="href"
            @click="navigate"
          />
        </router-link>

      </div>
    </div>
    <div
      class="login"
      v-else
    >
      Login to continue
      <LoginForm />
    </div>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import LoginForm from 'src/components/LoginForm'
import { CREATE_PATH } from 'src/router/routes'
import { USER, BUDGER } from 'src/store/namespace'
import { IS_AUTHENTICATED, HAS_BUDGERS, USER_BUDGERS } from 'src/store/user/getters'
import { HAS_EXPENSES, BUDGER_EXPENSES } from 'src/store/budger/getters'
import useApi, { BUDGERS_API } from 'src/use/useApi'

const { mapGetters: userGetters } = createNamespacedHelpers(USER);
const { mapGetters: budgerGetters } = createNamespacedHelpers(BUDGER);

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]

export default {
  data () {
    return {
      model: null,
      options: stringOptions
    }
  },
  components: {
    LoginForm
  },
  setup () {
    const { callApi } = useApi()

    return {
      callApi,
      CREATE_PATH,
    }
  },
  computed: {
    ...userGetters({
      isAuthenticated: IS_AUTHENTICATED,
      hasBudgers: HAS_BUDGERS,
      userBudgers: USER_BUDGERS,
    }),
    ...budgerGetters({
      hasExpenses: HAS_EXPENSES,
      budgerExpenses: BUDGER_EXPENSES,
    }),
    expensesData: ({ budgerExpenses }) => budgerExpenses.map(({
      id,
      amount,
      category,
      reference
    }) => ({
      id,
      amount,
      category,
      reference
    })),
    expensesColumns: () => ([
      {
        field: ({ id }) => id,
        label: 'ID',
        name: 'id',
      },
      {
        field: ({ amount }) => amount,
        format: val => `${val} €`,
        label: 'Amount',
        name: 'amount',
      },
      {
        field: ({ category }) => category.title,
        label: 'Category',
        name: 'category',
      },
      {
        field: ({ reference }) => reference,
        label: 'Ref',
        name: 'reference',
      },
    ])
  },
  methods: {
    async onSubmit () {
      await this.callApi(BUDGERS_API)
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = stringOptions

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>
