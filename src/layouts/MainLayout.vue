<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <router-link
          :to="CATEGORIES_PATH"
          v-slot="{ href, navigate, isActive, isExactActive }"
        >
          <q-btn
            type="a"
            label="user categories"
            :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
            :href="href"
            @click="navigate"
          />
        </router-link>
        <router-link
          :to="IMPORTER_PATH"
          v-slot="{ href, navigate, isActive, isExactActive }"
        >
          <q-btn
            type="a"
            label="importer"
            :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
            :href="href"
            @click="navigate"
          />
        </router-link>
        <router-link
          :to="COLLABORATORS_PATH"
          v-slot="{ href, navigate, isActive, isExactActive }"
        >
          <q-btn
            type="a"
            label="collaborators"
            :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
            :href="href"
            @click="navigate"
          />
        </router-link>
        <router-link
          :to="BUDGERS_PATH"
          v-slot="{ href, navigate, isActive, isExactActive }"
        >
          <q-btn
            type="a"
            label="budgers"
            :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
            :href="href"
            @click="navigate"
          />
        </router-link>
        <q-toolbar-title>
          <router-link :to="HOME_PATH">
            Quasar App
          </router-link>
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
        <div
          v-if="isAuthenticated"
          @click="logOut"
        >
          <div>
            {{userEmail}}
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
  CATEGORIES_PATH,
  BUDGERS_PATH,
  IMPORTER_PATH,
  COLLABORATORS_PATH,
} from 'src/router/routes'

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
      CATEGORIES_PATH,
      IMPORTER_PATH,
      COLLABORATORS_PATH,
      BUDGERS_PATH,
    }
  },
  computed: {
    ...userGetters({
      isAuthenticated: IS_AUTHENTICATED,
      userEmail: USER_EMAIL
    })
  },
  methods: {
    ...userActions({ logOut: LOG_OUT }),
  }
}
</script>
