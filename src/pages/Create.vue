<template>
  <q-page class="create">

    <h1>Create a new budger</h1>

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
import { LOG_IN } from 'src/store/user/action-types';
import { HOME_PATH } from 'src/router/routes';

import useApi, { BUDGERS } from 'src/use/useApi'

const { mapActions: userActions } = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      title: '',
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
      await this.callApi(BUDGERS, {
        method: 'POST',
        data: {
          title: this.title
        }
      })
      console.log(this.result)
      if (this.result) {
        // this.logIn(this.result)
        // this.$router.push({ path: HOME_PATH })
      } else {
        console.log('login failute')
      }
    },
  }
}
</script>
