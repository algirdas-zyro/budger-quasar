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

        <q-file
          clearable
          label="CSV"
          @input="handleCsvInput"
        />
        <q-table
          title="Expenses"
          row-key="id"
          :pagination="{rowsPerPage:0}"
          :data="budgerExpenses"
          :columns="expensesColumns"
        >
          <template v-slot:body-cell-category="props">
            <q-td :props="props">
              <q-select
                dense
                map-options
                label="Category"
                style="width: 250px"
                option-value="id"
                option-label="title"
                :value="props.row.category.id"
                :options="userCategories"
                @input="handleCategoryInput($event, props.row.id)"
              />
            </q-td>
          </template>
        </q-table>

        <q-table
          title="Expenses"
          row-key="reference"
          :pagination="{rowsPerPage:0}"
          :data="importedExpenses"
          :columns="expensesColumns"
        >
          <template v-slot:body-cell-category="props">
            <q-td :props="props">
              <q-select
                v-if="props.row.category"
                dense
                map-options
                label="Category"
                style="width: 250px"
                option-value="id"
                option-label="title"
                :value="props.row.category.id"
                :options="userCategories"
                @input="handleCategoryInput($event, props.row.id)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-reference="props">
            <q-td :props="props">
              {{props.row.reference}}
            </q-td>
          </template>
        </q-table>
      </div>
      <div
        class="list"
        v-else-if="hasBudgers"
      >
        <div class="budgers">
          <div
            class="budger"
            v-for="({ title, id }) in userBudgers"
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
import Papa from 'papaparse';
import moment from 'moment';

import LoginForm from 'src/components/LoginForm'
import { CREATE_PATH } from 'src/router/routes'
import { USER, BUDGER } from 'src/store/namespace'
import { IS_AUTHENTICATED, USER_BUDGERS, USER_CATEGORIES } from 'src/store/user/getters'
import { BUDGER_EXPENSES } from 'src/store/budger/getters'
import useApi, { BUDGERS_API } from 'src/use/useApi'
import { UPDATE_ENTRY_CATEGORY } from 'src/store/budger/actions';

const { mapGetters: userGetters } = createNamespacedHelpers(USER);
const {
  mapGetters: budgerGetters,
  mapActions: budgerActions
} = createNamespacedHelpers(BUDGER);

export default {
  data () {
    return {
      csv: null,
      importedExpenses: []
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
      userBudgers: USER_BUDGERS,
      userCategories: USER_CATEGORIES,
    }),
    ...budgerGetters({
      budgerExpenses: BUDGER_EXPENSES,
    }),
    hasBudgers: ({ userBudgers }) => !!userBudgers.length,
    hasCategories: ({ userCategories }) => !!userCategories.length,
    hasExpenses: ({ budgerExpenses }) => !!budgerExpenses.length,
    expensesColumns: () => ([
      {
        field: ({ id }) => id,
        label: 'ID',
        name: 'id',
      },
      {
        field: ({ date }) => date,
        format: val => moment(val).format('YYYY-MM-DD'),
        label: 'Date',
        name: 'date',
      },
      {
        field: ({ amount }) => amount,
        format: val => `${val} €`,
        label: 'Amount',
        name: 'amount',
      },
      {
        field: ({ category }) => category?.id,
        label: 'Category',
        name: 'category',
      },
      {
        field: ({ reference }) => reference,
        label: 'Ref',
        name: 'reference',
      },
    ]).map((column) => ({
      ...column,
      sortable: true,
      align: 'left',
      style: 'white-space: normal',
    })),
  },
  methods: {
    ...budgerActions({
      updateEntryCategory: UPDATE_ENTRY_CATEGORY,
    }),
    handleCategoryInput (category, expenseId) {
      this.updateEntryCategory({ category, expenseId })
    },
    mapCategories (reference) {
      return this.userCategories.find((category) => {
        return category.mappings?.some((mapping) => {
          return reference.includes(mapping.toLowerCase())
        })
      })
    },
    handleCsvInput (e) {
      if (!e) return;

      Papa.parse(e, {
        delimiter: ';',
        complete: ({ data }) => {
          this.importedExpenses = data.map((row, i) => {
            const reference = `${row[4]} ${row[9]} ${row[12]}`;
            const category = this.mapCategories(reference.toLowerCase()) ?? {};
            return {
              category,
              reference,
              id: null,
              date: row[1],
              amount: +row[3]?.replace(',', '.'),
            }
          }).filter(({ amount }) => !isNaN(amount))
        },
        error: (error) => {
          console.log(error); // TODO - add error handling
        },
      });
    }
  }
}
</script>
