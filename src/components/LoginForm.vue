<template>
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

    <q-checkbox
      v-model="remember"
      label="Remember me"
    />
  </q-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { USER } from 'src/store/namespace';
import { LOG_IN } from 'src/store/user/actions';
import { HOME_PATH } from 'src/router/routes';

import useApi, { AUTH_LOCAL_API } from 'src/use/useApi'

const { mapActions: userActions } = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      email: '',
      password: '',
      remember: true,
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
      const { email, password, remember, callApi, $router } = this
      const { jwt, user } = await callApi(AUTH_LOCAL_API, {
        method: 'POST',
        data: {
          identifier: email,
          password,
        }
      })

      if (!jwt || !user) return

      this.logIn({ jwt, user, remember })
      $router.push({ path: HOME_PATH })
    },
  }
}
</script>
