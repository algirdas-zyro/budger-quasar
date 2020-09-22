<template>
  <q-page class="create">

    <h1>Hi m8!</h1>
    <div class="sucsses">
      <p>your mail seems to be the one we're looking for</p>
    </div>
    <div class="login">
      plz login or create an account to verify
    </div>
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
import SimpleCrypto from "simple-crypto-js"

import { USER } from 'src/store/namespace';
import { LOG_IN } from 'src/store/user/actions';
import { HOME_PATH } from 'src/router/routes';
import { USER_EMAIL } from 'src/store/user/getters';

import useApi, { INVITATIONS_API } from 'src/use/useApi'

const { mapActions: userActions } = createNamespacedHelpers(USER);

const secretKey = "some-unique-key"; // :D
const simpleCrypto = new SimpleCrypto(secretKey)
const {
  mapGetters: userGetters,
} = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      email: 'algirdas.tamasauskas@gmail.com',
    }
  },
  created () {
    const { id } = this.$route.params
    const decrypedEmail = simpleCrypto.decrypt(id)
    console.log(decrypedEmail, this.userEmail)
    if (decrypedEmail === this.userEmail) {
      console.log('success!')
    } else {
      console.log('go back!')
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
  computed: {
    ...userGetters({
      userEmail: USER_EMAIL
    })
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
