<template>
  <q-page class="create">

    <h1>Create a new budger</h1>

    <CreateForm
      set-as-main
      @create="handleCreate"
    />
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import CreateForm from 'src/components/CreateForm'

import { USER } from 'src/store/namespace';
import { UPDATE_MAIN_BUDGER } from 'src/store/user/actions';
import { HOME_PATH } from 'src/router/routes';

import useApi, { BUDGERS_API } from 'src/use/useApi'

const { mapActions: userActions } = createNamespacedHelpers(USER);

export default {
  components: {
    CreateForm
  },
  methods: {
    ...userActions({
      updateMainBudger: UPDATE_MAIN_BUDGER
    }),
    handleCreate (createdBudger) {
      this.updateMainBudger(createdBudger);
    },
  }
}
</script>
