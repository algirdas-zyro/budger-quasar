<template>
  <q-page class="login">

    <h1 class="text-h1">Login</h1>

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
        hint="Minimum 8 character"
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

      <q-btn
        label="Log In"
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

import useApi, { AUTH_LOCAL } from 'src/use/useApi'

const { mapActions: userActions } = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      email: 'algirdas.tamasauskas@gmail.com',
      password: '8simboliai',
      hidePassword: true,
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
      await this.callApi(AUTH_LOCAL, {
        method: 'POST',
        data: {
          identifier: this.email,
          password: this.password,
        }
      })
      if (this.result) {
        this.logIn(this.result)
        this.$router.push({ path: HOME_PATH })
      } else {
        console.log('login failute')
      }
    },
  }
}
</script>
