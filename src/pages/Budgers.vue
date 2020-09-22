<template>
  <q-page class="create">
    <q-table
      title="My Budgers"
      :data="budgersData"
      :columns="budgersColumns"
      :pagination="{rowsPerPage:0}"
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
            <q-form>
              <q-input
                bottom-slots
                v-model="props.row.title"
                label="Budger Title"
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
              v-for="(mapping, index) in props.row.collaborators"
              :key="index"
              @remove="handleRemoveCollaboratorClick(props.row.id, mapping)"
              :label="mapping"
            />
          </q-td>

          <q-td auto-width>
            <q-form @submit="handlCollaboratorsSubmit(props.row.id, props.row.index)">

              <div class="create">
                <q-input
                  bottom-slots
                  v-model="props.row.newCollaboratorInput"
                  label="new collaborator"
                >
                  <template v-slot:append>
                    <q-btn
                      dense
                      flat
                      icon="send"
                      type="submit"
                      color="primary"
                      @click="handlCollaboratorsSubmit(props.row.id, props.row.index)"
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
  CREATE_BUDGER,
  UPDATE_BUDGER,
  DELETE_BUDGER,
  CREATE_BUDGER_COLLABORATOR,
  DELETE_BUDGER_COLLABORATOR,
} from 'src/store/user/actions';

import { HOME_PATH } from 'src/router/routes';

import useApi, { BUDGERS_API } from 'src/use/useApi'
import { USER_BUDGERS } from 'src/store/user/getters';

const {
  mapActions: userActions,
  mapGetters: userGetters
} = createNamespacedHelpers(USER);

export default {
  setup () {
    const {
      isLoading,
      hasLoaded,
      hasFailed,
      errorMessage,
      result,
      callApi
    } = useApi()

    return {
      isLoading,
      hasLoaded,
      hasFailed,
      errorMessage,
      result,
      callApi
    }
  },
  data () {
    return {
      title: '',
      budgersData: [],
    }
  },
  watch: {
    // Whenever the movie prop changes, fetch new data
    userBudgers: {
      // Will fire as soon as the component is created
      immediate: true,
      handler (userBudgers, previousBudgers) {
        if (userBudgers !== previousBudgers) {
          this.budgersData = userBudgers?.map(({
            id,
            title,
            collaborators,
          }, index) => ({
            id,
            index,
            title,
            collaborators,
            readonly: true,
            newCollaboratorInput: ''
          }))
        }
      }
    },
  },
  computed: {
    ...userGetters({
      userBudgers: USER_BUDGERS
    }),
    budgersColumns: () => ([{
      field: ({ title }) => title,
      label: 'Title',
      name: 'title',
      align: 'left'
    }])
  },
  methods: {
    ...userActions({
      createBudger: CREATE_BUDGER,
      updateBudger: UPDATE_BUDGER,
      deleteBudger: DELETE_BUDGER,
      createBudgerCollaborator: CREATE_BUDGER_COLLABORATOR,
      deleteBudgerCollaborator: DELETE_BUDGER_COLLABORATOR,
    }),
    handleDeleteClick (id) {
      this.deleteBudger(id)
    },
    handleRemoveCollaboratorClick (categoryId, mapping) {
      this.deleteCategoryCollaborator({ categoryId, mapping })
    },
    handlCollaboratorsSubmit (categoryId, index) {
      const { newCollaboratorInput } = this.budgersData[index]
      this.createCategoryCollaborator({ categoryId, mapping: newCollaboratorInput })
      this.budgersData[index].newCollaboratorInput = ''
    },
    handleTitleBtnClick (index) {
      const budger = { ...this.budgersData[index] };
      if (budger.readonly) {
        this.budgersData[index].readonly = false;
        this.$refs[`titleInput${budger.id}`].focus()
      } else {
        this.handleTitleUpdateSubmit(index);
      }
    },
    handleTitleUpdateSubmit (index) {
      const budger = { ...this.budgersData[index] };
      this.budgersData[index].readonly = true;
      delete budger.index;
      this.updateBudger(budger);
    },
    async handleSubmit () {
      this.createBudger(this.title)
    },
  }
}
</script>
