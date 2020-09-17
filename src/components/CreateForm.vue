<template>
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
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { USER } from 'src/store/namespace';
import { LOG_IN } from 'src/store/user/actions';
import { HOME_PATH } from 'src/router/routes';

import useApi, { BUDGERS_API } from 'src/use/useApi'

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
      await this.callApi(BUDGERS_API, {
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
