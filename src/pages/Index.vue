<template>
  <q-page class="flex flex-center">

    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <q-btn
        label="Get Expenses"
        type="submit"
        color="primary"
      />
    </q-form>
  </q-page>
</template>

<script>
import useApi, { EXPENSES } from 'src/use/useApi'

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
  methods: {
    async onSubmit () {
      await this.callApi(EXPENSES)
      console.log(this.result)
    },
  }
}
</script>
