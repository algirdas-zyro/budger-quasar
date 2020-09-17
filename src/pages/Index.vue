<template>
  <q-page class="flex flex-center">
    <div
      class="login"
      v-if="!isAuthenticated"
    >
      Login to continue
      <LoginForm />
    </div>
    <div
      class="budgers"
      v-if="isAuthenticated"
    >
      <div
        class="list"
        v-if="hasBudgers"
      >
        <div class="budgers">
          <div
            class="budger"
            v-for="({title, id}) in userBudgers"
            :key="id"
          >{{title}}</div>
        </div>
        <div
          class="create"
          v-if="!hasBudgers"
        >
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

        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import LoginForm from 'src/components/LoginForm'
import { CREATE_PATH } from 'src/router/routes'
import { USER } from 'src/store/namespace'
import { IS_AUTHENTICATED, HAS_BUDGERS, USER_BUDGERS } from 'src/store/user/getters'
import useApi, { BUDGERS_API } from 'src/use/useApi'

const { mapGetters: userGetters } = createNamespacedHelpers(USER);

export default {
  CREATE_PATH,
  components: {
    LoginForm
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
      callApi,
      CREATE_PATH
    }
  },
  computed: {
    ...userGetters({
      isAuthenticated: IS_AUTHENTICATED,
      hasBudgers: HAS_BUDGERS,
      userBudgers: USER_BUDGERS,
    })
  },
  methods: {
    async onSubmit () {
      await this.callApi(BUDGERS_API)
    },
  }
}
</script>
