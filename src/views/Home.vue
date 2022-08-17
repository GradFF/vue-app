<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '../store/database'
import { useUserStore } from '../store/user'

const userStore = useUserStore()
const databaseStore = useDatabaseStore()
const router = useRouter()

const url = ref('')
const handleSubmit = async () => {
  await databaseStore.addUrl(url.value)
  console.log('Adicionado.')
}

onBeforeMount(async () => {
  await databaseStore.getUrls()
})
</script>
<template>
  <h1>Home</h1>
  <p>Ben-vindo: {{ userStore.userData.email }}</p>

  <form @submit.prevent="handleSubmit">
    <input type="text" placeholder="url" v-model.trim="url" />
    <button type="submit" :disabled="databaseStore.loadingDoc">
      Adicionar
    </button>
  </form>

  <ul v-if="!databaseStore.loading">
    <li v-for="item in databaseStore.documents" :key="item.id">
      {{ item.id }} <br />
      {{ item.name }}<br />
      {{ item.short }}
      <div>
        <button
          @click="databaseStore.removeUrl(item.id)"
          :disabled="databaseStore.loadingDoc"
        >
          Deletar
        </button>
        <button @click="router.push(`/editar/${item.id}`)">Editar</button>
      </div>
    </li>
  </ul>
  <div v-else>loading...</div>
</template>
