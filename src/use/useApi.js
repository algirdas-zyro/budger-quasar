/* eslint-disable no-console */
/* eslint no-console: ["error", { allow: ["error"] }] */
import { ref, reactive, computed, getCurrentInstance } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import axios from 'axios'
import { Notify } from 'quasar'

import { IS_AUTHENTICATED, JWT_TOKEN } from 'src/store/user/getter-types';
import { USER } from 'src/store/namespace';

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

export default function useApi () {
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const hasFailed = ref(false)

  const error = ref(null)
  const result = ref(null)
  const requestConfig = reactive({})

  // const errorMessage = computed(() => error.value?.message)
  const errorMessage = computed(() => {
    if (error.value?.response?.status === 400) {
      // Deeply nested first Stapi message:
      return error.value?.response?.data?.message?.[0]?.messages?.[0]?.message
    }
    return error.value?.message
  })

  const {
    isAuthenticated,
    jwtToken
  } = useUserGetters({
    jwtToken: JWT_TOKEN,
    isAuthenticated: IS_AUTHENTICATED,
  })

  const errorHandler = (err) => {
    hasFailed.value = true
    error.value = { ...err, message: err.message }
    Notify.create({
      message: 'Error',
      caption: errorMessage.value,
      position: 'top-right',
      timeout: 4000,
      type: 'negative',
      progress: true,
      actions: [{ icon: 'close', color: 'white' }]
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
export const EXPENSES = 'expenses'
export const AUTH_LOCAL = 'auth/local'
export const AUTH_LOCAL_REGISTER = 'auth/local/register'
