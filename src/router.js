import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './store/user'
import Home from './views/Home.vue'
import Edit from './views/Edit.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import NotFound from './views/NotFound.vue'
import { useDatabaseStore } from './store/database'

const requireAuth = async (to, from, next) => {
  const userStore = useUserStore()
  userStore.loading = true

  const user = await userStore.currentUser()

  if (user && user.emailVerified) {
    next()
  } else {
    next('/login')
  }
  userStore.loading = false
}

const redireccion = async (to, from, next) => {
  const userStore = useUserStore()
  const databaseStore = useDatabaseStore()
  userStore.loadingSession = true
  const name = await databaseStore.searchURL(to.params.pathMatch[0])
  if (!name) {
    next()
    userStore.loadingSession = false
  } else {
    userStore.loadingSession = true
    next()
  }
}

const routes = [
  { path: '/', component: Home, beforeEnter: requireAuth },
  { path: '/editar/:id', component: Edit, beforeEnter: requireAuth },
  { path: '/login', component: Login },
  { path: '/register', component: Register },

  {
    name: 'redireccion',
    path: '/:pathMatch(.*)*',
    component: NotFound,
    beforeEnter: redireccion
  }
]

const history = createWebHistory()

const router = createRouter({
  history,
  routes
})

export default router
