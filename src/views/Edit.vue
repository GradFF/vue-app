<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDatabaseStore } from '../store/database'

const route = useRoute()
const router = useRouter()
const databaseStore = useDatabaseStore()
const url = ref('')

onMounted(async () => {
  url.value = await databaseStore.getUrl(route.params.id)
})

const handleSubmit = async () => {
  await databaseStore.updateUrl(route.params.id, url.value)
  router.push('/')
}
</script>
<template>
  <div>
    <h1>Editar</h1>
    <p v-if="databaseStore.loadingDoc">loading doc...</p>

    <form @submit.prevent="handleSubmit">
      <input type="text" placeholder="url" v-model.trim="url" />
      <button type="submit" :disabled="databaseStore.loadingDoc">Editar</button>
    </form>
  </div>
</template>
