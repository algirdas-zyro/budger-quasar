<template>
  <q-page class="login">

    <h1 class="text-h1">Login</h1>

    <LoginForm />

  </q-page>
</template>

<script>
import LoginForm from 'src/components/LoginForm'

export default {
  components: {
    LoginForm
  }
}
</script>
