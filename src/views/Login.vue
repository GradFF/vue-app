<script setup>
import { ref } from 'vue'
import { useUserStore } from '../store/user'

const useStore = useUserStore()

const email = ref('mrfneto@gmail.com')
const password = ref('password')

const handleSubmit = async () => {
  if (!email.value || password.value.length < 6) {
    alert('Preencha os campos E-mail e Senha')
  }

  const res = await useStore.loginUser(email.value, password.value)
  if (res === 'auth/wrong-password') {
    message.error('credenciales no válidas')
  }
}
</script>
<template>
  <h1>Login</h1>
  <form @submit.prevent="handleSubmit">
    <input type="email" placeholder="E-mail" v-model.trim="email" />
    <input type="password" placeholder="Senha" v-model.trim="password" />

    <button type="submit" :disabled="useStore.loadingUser">Entrar</button>
  </form>
</template>
