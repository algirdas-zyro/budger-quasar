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
              v-for="(collaborator, index) in props.row.collaborators"
              :key="index"
              @remove="handleRemoveCollaboratorClick(props.row.id, collaborator)"
              :label="collaborator.email"
            />
          </q-td>

          <q-td style="white-space:normal">
            <q-chip
              removable
              v-for="(invitation, index) in props.row.invitations"
              :key="index"
              @remove="handleRemoveInvitationClick(props.row.index, invitation.id)"
              :label="invitation.to"
            />
          </q-td>

          <q-td auto-width>
            <q-form>

              <div class="create">
                <q-input
                  bottom-slots
                  lazy-rules
                  v-model="props.row.newInvitationEmail"
                  label="new collaborator"
                  type="email"
                  :ref="`emailInput${props.row.index}`"
                  :rules="[
                    val => val.length || 'Field is required',
                    val => val.match(/\S+@\S+\.\S+/g) || 'Not an email',
                    val => val !== userEmail || 'Cannot invite self',
                    val => !props.row.invitations.some((invitation) => invitation.to === val) || 'Already exists',
                    val => !props.row.collaborators.some((collaborator) => collaborator.to === val) || 'Already exists',
                  ]"
                >
                  <template v-slot:append>
                    <q-btn
                      dense
                      flat
                      icon="send"
                      type="submit"
                      color="primary"
                      @click="handleInvitationsSubmit(props.row.index)"
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
  CREATE_BUDGER_INVITATION,
  DELETE_BUDGER_INVITATION,
  CREATE_BUDGER_COLLABORATOR,
  DELETE_BUDGER_COLLABORATOR,
} from 'src/store/user/actions';

import { HOME_PATH } from 'src/router/routes';

import useApi, { BUDGERS_API } from 'src/use/useApi'
import { USER_BUDGERS, USER_EMAIL } from 'src/store/user/getters';

const {
  mapActions: userActions,
  mapGetters: userGetters
} = createNamespacedHelpers(USER);

export default {
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
            invitations,
          }, index) => ({
            id,
            index,
            title,
            collaborators,
            invitations,
            readonly: true,
            newInvitationEmail: '',
          }))
        }
      }
    },
  },
  computed: {
    ...userGetters({
      userBudgers: USER_BUDGERS,
      userEmail: USER_EMAIL,
    }),
    budgersColumns: () => ([{
      field: ({ title }) => title,
      label: 'Title',
      name: 'title',
      align: 'left'
    }]),
  },
  methods: {
    ...userActions({
      createBudger: CREATE_BUDGER,
      updateBudger: UPDATE_BUDGER,
      deleteBudger: DELETE_BUDGER,
      createBudgerInvitation: CREATE_BUDGER_INVITATION,
      deleteBudgerInvitation: DELETE_BUDGER_INVITATION,
      createBudgerCollaborator: CREATE_BUDGER_COLLABORATOR,
      deleteBudgerCollaborator: DELETE_BUDGER_COLLABORATOR,
    }),
    handleCollaboratorsSubmit (index) {
      // const { newCollaboratorEmail } = this.budgersData[index];
      // this.createBudgerCollaborator({ newCollaboratorEmail, index });
      // this.budgersData[index].newCollaboratorEmail = '';
    },
    handleRemoveCollaboratorClick (budgerId, collaborator) {
      // this.deleteBudgerCollaborator({ budgerId, collaborator });
    },
    async handleInvitationsSubmit (index) {
      const email = this.$refs[`emailInput${index}`];
      if (!await email.validate()) return;
      const { newInvitationEmail } = this.budgersData[index];
      this.createBudgerInvitation({ newInvitationEmail, index });
      this.budgersData[index].newInvitationEmail = '';
      email.resetValidation();
    },
    handleRemoveInvitationClick (budgerIndex, invitationId) {
      this.deleteBudgerInvitation({ budgerIndex, invitationId });
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
    handleSubmit () {
      this.createBudger(this.title)
    },
    handleDeleteClick (id) {
      this.deleteBudger(id);
    },
  }
}
</script>
