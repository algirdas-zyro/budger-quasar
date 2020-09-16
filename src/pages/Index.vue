<template>
  <q-page class="flex flex-center">
    <router-link
      :to="$options.CREATE_PATH"
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
  </q-page>
</template>

<script>
import useApi, { BUDGERS } from 'src/use/useApi'
import { CREATE_PATH } from '../router/routes'

export default {
  CREATE_PATH,
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
    async onSubmit () {
      await this.callApi(BUDGERS)
      console.log(this.result)
    },
  }
}
</script>
