<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
        <div
          v-if="isAuthenticated"
          @click="logOut"
        >
          <div>
            {{getEmail}}
          </div>
          <router-link
            :to="HOME_PATH"
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <q-btn
              type="a"
              :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
              :href="href"
              label="LOG OUT"
              @click="navigate"
            />
          </router-link>
        </div>
        <div v-if="!isAuthenticated">
          <router-link
            :to="LOGIN_PATH"
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <q-btn
              type="a"
              label="LOG IN"
              :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
              :href="href"
              @click="navigate"
            />
          </router-link>
          <router-link
            :to="REGISTER_PATH"
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <q-btn
              type="a"
              label="REGISTER"
              :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
              :href="href"
              @click="navigate"
            />
          </router-link>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { LOG_OUT } from 'src/store/user/actions';
import { USER } from 'src/store/namespace';
import {
  HOME_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
} from '../router/routes'

import { USER_EMAIL, IS_AUTHENTICATED } from 'src/store/user/getters';

const {
  mapActions: userActions,
  mapGetters: userGetters
} = createNamespacedHelpers(USER);

export default {
  setup () {
    return {
      HOME_PATH,
      LOGIN_PATH,
      REGISTER_PATH,
    }
  },
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
  computed: {
    ...userGetters({
      isAuthenticated: IS_AUTHENTICATED,
      getEmail: USER_EMAIL
    })
  },
  methods: {
    ...userActions({ logOut: LOG_OUT }),
  }
}
</script>
