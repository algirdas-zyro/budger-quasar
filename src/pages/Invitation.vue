<template>
  <q-page class="create">

    <h1>Hi m8!</h1>
    <div class="sucsses">
      <p>your mail seems to be the one we're looking for</p>
    </div>
    <div class="login">
      plz login or create an account to verify
    </div>

  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import SimpleCrypto from "simple-crypto-js"

import { USER } from 'src/store/namespace';
import {
  ACCEPT_INVITATION,
  UPDATE_ENCRYPTED_INVITATION,
} from 'src/store/user/actions';
import { USER_EMAIL } from 'src/store/user/getters';
import { INVITATION_PATH } from 'src/router/routes';


const SECRET_KEY = "some-unique-key"; // :D
const simpleCrypto = new SimpleCrypto(SECRET_KEY)
const { mapActions: userActions } = createNamespacedHelpers(USER);
const { mapGetters: userGetters } = createNamespacedHelpers(USER);

export default {
  data () {
    return {
      email: 'algirdas.tamasauskas@gmail.com',
    }
  },
  created () {
    const { id } = this.$route.params
    const [decrypedEmail, invitationId] = simpleCrypto.decrypt(id).split('|');
    this.updateEncryptionHash(id);
    if (!this.userEmail) return;
    if (decrypedEmail === this.userEmail) {
      this.acceptInvitation(invitationId);
    }
  },
  computed: userGetters({ userEmail: USER_EMAIL }),
  methods: {
    ...userActions({
      updateEncryptionHash: UPDATE_ENCRYPTED_INVITATION,
      acceptInvitation: ACCEPT_INVITATION,
    }),
  }
}
</script>
