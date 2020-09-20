<template>
  <q-page class="flex flex-center">
    <q-file
      clearable
      label="CSV"
      @input="handleCsvInput"
    />
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
            @input="handleCategoryInput($event, props.row.index)"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-reference="props">
        <q-td :props="props">
          {{props.row.reference}}
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Papa from 'papaparse';
import moment from 'moment';
import Vue from 'Vue';

import { USER, BUDGER } from 'src/store/namespace'
import { USER_CATEGORIES } from 'src/store/user/getters'
import { UPDATE_ENTRY_CATEGORY } from 'src/store/budger/actions';

const { mapGetters: userGetters } = createNamespacedHelpers(USER);
const { mapActions: budgerActions } = createNamespacedHelpers(BUDGER);

export default {
  data () {
    return {
      csv: null,
      importedExpenses: []
    }
  },
  computed: {
    ...userGetters({
      userCategories: USER_CATEGORIES,
    }),
    hasCategories: ({ userCategories }) => !!userCategories.length,
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
    handleCategoryInput (category, expenseIndex) {
      this.importedExpenses = this.importedExpenses.map((expense) => {
        if (expense.index === expenseIndex) expense.category = category
        return expense
      })
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
          this.importedExpenses = data.map((row, index) => {
            const reference = `${row[4]} ${row[9]} ${row[12]}`;
            const category = this
              .mapCategories(reference.toLowerCase()) ?? {};
            return {
              category,
              reference,
              index,
              id: null,
              date: row[1],
              amount: +row[3]?.replace(',', '.'),
            }
          })
            .filter(({ amount }) => !isNaN(amount))
        },
        error: (error) => {
          console.log(error); // TODO - add error handling
        },
      });
    }
  }
}
</script>
