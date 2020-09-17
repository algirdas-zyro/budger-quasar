<template>
  <q-page class="login">

    <h1 class="text-h1">Register</h1>

    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <q-input
        filled
        label="Email"
        v-model="email"
        type="email"
      >
        <template v-slot:before>
          <q-icon name="mail" />
        </template>
      </q-input>

      <q-input
        v-model="password"
        filled
        :type="hidePassword ? 'password' : 'text'"
        label="Password"
        hint="Minimum 8 characters"
      >
        <template v-slot:before>
          <q-icon name="lock" />
        </template>
        <template v-slot:after>
          <q-icon
            :name="hidePassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @mousedown="hidePassword = false"
            @mouseup="hidePassword = true"
            @mouseleave="hidePassword = true"
          />
        </template>
      </q-input>

      <q-input
        filled
        label="User name"
        v-model="username"
      >
        <template v-slot:before>
          <q-icon name="face" />
        </template>
      </q-input>

      <div>
        <q-btn
          label="Register"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { USER } from 'src/store/namespace';
import { LOG_IN } from 'src/store/user/actions';

import useApi, { AUTH_LOCAL_REGISTER_API } from 'src/use/useApi'

const {
  mapActions: userActions,
  mapGetters: userGetters
} = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      username: '',
      email: 'algirdas.tamasauskas@gmail.com',
      password: '8simboliai',
      hidePassword: true,
    }
  },
  setup (ctx, props) {
    const {
      isLoading,
      hasLoaded,
      hasFailed,
      error,
      errorMessage,
      result,
      callApi
    } = useApi(ctx, props)

    return {
      isLoading,
      hasLoaded,
      hasFailed,
      error,
      errorMessage,
      result,
      callApi
    }
  },
  methods: {
    ...userActions({ logIn: LOG_IN }),
    async onSubmit () {
      const username = this.username || this.email.split('@')[0]
      await this.callApi(AUTH_LOCAL_REGISTER_API, {
        method: 'POST',
        data: {
          username,
          email: this.email,
          password: this.password,
        }
      })
      if (this.result) {
        this.logIn(this.result)
      }
    }
  }
}
</script>
