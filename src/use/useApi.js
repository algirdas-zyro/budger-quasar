/* eslint-disable no-console */
/* eslint no-console: ["error", { allow: ["error"] }] */
import { ref, reactive, computed, getCurrentInstance } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import axios from 'axios'
import { Notify } from 'quasar'

import { USER } from 'src/store/namespace';
import { IS_AUTHENTICATED, JWT_TOKEN } from 'src/store/user/getters';

const { useGetters: useUserGetters } = createNamespacedHelpers(USER); // specific module name

// default axios request config
const DEFAULT_CONFIG = {
  method: 'get',
  baseURL: process.env.API_URL,
  headers: {
    common: {
      Accept: 'application/json'
    }
  }
}

const NOTIFY_TIMEOUT = 4000
const NOTIFY_MESSAGE_TITLE = 'Error'
const NOTIFY_POSITION = 'top-right'
const NOTIFY_TYPE = 'negative'
const NOTIFY_CLOSE_ICON = 'close'
const NOTIFY_CLOSE_COLOR = 'white'

export default function useApi () {
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const hasFailed = ref(false)

  const error = ref(null)
  const result = ref(null)
  const requestConfig = reactive({})

  // const errorMessage = computed(() => error.value?.message)
  const errorMessage = computed(() => {
    // Deeply nested first Stapi messages:
    const { status, data } = error.value?.response ?? {}
    if (status === 400 || status === 429) { return data?.message?.[0]?.messages?.[0]?.message }
    if (status === 403) { return data?.message }
    return error.value?.message
  })

  const { isAuthenticated, jwtToken } = useUserGetters({
    jwtToken: JWT_TOKEN,
    isAuthenticated: IS_AUTHENTICATED,
  })

  const errorHandler = (err) => {
    hasFailed.value = true
    error.value = { ...err, message: err.message }
    Notify.create({
      caption: errorMessage.value,
      progress: true,
      message: NOTIFY_MESSAGE_TITLE,
      position: NOTIFY_POSITION,
      timeout: NOTIFY_TIMEOUT,
      type: NOTIFY_TYPE,
      actions: [{
        icon: NOTIFY_CLOSE_ICON,
        color: NOTIFY_CLOSE_COLOR
      }]
    })
  }

  const callApi = async (url, config = {}) => {
    isLoading.value = true
    hasLoaded.value = false
    hasFailed.value = false
    requestConfig.value = { url, ...DEFAULT_CONFIG, ...config }

    if (isAuthenticated.value) {
      requestConfig.value.headers.Authorization = `Bearer ${jwtToken.value}`
    }

    try {
      const { data } = await axios(requestConfig.value)
      if (data) {
        result.value = data
        hasLoaded.value = true
        return data
      } else {
        errorHandler(new Error('A malformed response'))
      }
    } catch (err) {
      errorHandler(err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    hasLoaded,
    hasFailed,
    error,
    errorMessage,
    result,
    callApi
  }
}

// export endpoints for use in components
export const BUDGERS_API = 'budgers'
export const CATEGORIES_API = 'categories'
export const AUTH_LOCAL_API = 'auth/local'
export const AUTH_LOCAL_REGISTER_API = 'auth/local/register'
