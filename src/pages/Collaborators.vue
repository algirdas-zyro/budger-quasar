<template>
  <q-page class="create">

    <h1>Collaborators</h1>

    <div class="add">

      <q-form
        @submit="onSubmit"
        class="q-gutter-md"
      >
        <q-input
          filled
          label="Email"
          v-model="email"
          type="email"
        />
        <q-btn
          label="Invite"
          type="submit"
          color="primary"
        />
      </q-form>
    </div>
    <div class="list">list</div>

  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { USER } from 'src/store/namespace';
import { LOG_IN } from 'src/store/user/actions';
import { HOME_PATH } from 'src/router/routes';

import useApi, { INVITATIONS_API } from 'src/use/useApi'

const { mapActions: userActions } = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      email: 'algirdas.tamasauskas@gmail.com',
    }
  },
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
  methods: {
    ...userActions({ logIn: LOG_IN }),
    async onSubmit () {
      console.log('invite!')
      await this.callApi(INVITATIONS_API, {
        method: 'POST',
        data: {
          to: this.email
        }
      })
    },
  }
}
</script>
