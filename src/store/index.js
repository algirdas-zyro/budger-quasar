import Vue from 'vue';
import Vuex from 'vuex';

import { USER, BUDGER, SOCKET } from './namespace';
import user from './user';
import budger from './budger';
import socket from './socket';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      [USER]: user,
      [BUDGER]: budger,
      [SOCKET]: socket,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
