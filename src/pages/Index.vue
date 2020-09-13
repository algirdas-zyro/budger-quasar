<template>
  <q-page class="flex flex-center">
    <q-input v-model="text" label="Standard" />
  </q-page>
</template>

<script>
import { LOG_IN } from '../store/user/action-types';
import { GET_USER_DATA } from '../store/user/getter-types';
import { USER } from '../store/namespace';

import {createNamespacedHelpers} from 'vuex';

const { mapActions: userActions, mapGetters: userGetters } = createNamespacedHelpers(USER);

export default {
  name: 'PageIndex',
  data() {
    return {
      text: ''
    }
  },
  computed: {
    ...userGetters({
      getUserData: GET_USER_DATA
    })
  },
  watch: {
		text: {
			handler(input) {
        this.logIn(input);
			}
		}
  },
  methods: {
    ...userActions({
      logIn: LOG_IN
    })
  }
}
</script>
