<script setup>
import { ref } from 'vue'
import { useUserStore } from '../store/user'

const useStore = useUserStore()

const email = ref('mrfneto@gmail.com')
const password = ref('password')

const handleSubmit = () => {
  if (!email.value || password.value.length < 6) {
    alert('Preencha os campos E-mail e Senha')
  }
  try {
    useStore.registerUser(email.value, password.value)
    alert('Verifique seu e-mail')
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <h1>Register</h1>
  <form @submit.prevent="handleSubmit">
    <input type="email" placeholder="E-mail" v-model.trim="email" />
    <input type="password" placeholder="Senha" v-model.trim="password" />

    <button type="submit" :disabled="useStore.loadingUser">Criar Conta</button>
  </form>
</template>
