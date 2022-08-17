<script setup>
import { useUserStore } from './store/user'

const userStore = useUserStore()

console.log(userStore.userData)
</script>
<template>
  <div v-if="userStore.loading">Loading...</div>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/login" v-if="!userStore.userData">Login</router-link> |
    <router-link to="/register" v-if="!userStore.userData"
      >Register</router-link
    >
    |
    <button @click="userStore.logoutUser" v-if="userStore.userData">
      Logout
    </button>
  </nav>
  <router-view />
</template>
