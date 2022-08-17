import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { defineStore } from 'pinia'
import { auth } from '../firebaseConfig'
import { useDatabaseStore } from './database'
import router from '../router'

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null,
    loadingUser: false,
    loading: false
  }),
  getters: {
    //
  },
  actions: {
    async registerUser(email, password) {
      this.loadingUser = true
      try {
        await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(auth.currentUser)
        router.push('/')
      } catch (error) {
        console.log(error)
        this.userData = null
      } finally {
        this.loadingUser = false
      }
    },

    async loginUser(email, password) {
      this.loadingUser = true
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        this.userData = { email: user.email, uid: user.uid }
        router.push('/')
      } catch (error) {
        console.log(error)
        this.userData = null
      } finally {
        this.loadingUser = false
      }
    },

    async logoutUser() {
      this.loadingUser = true
      const databaseStore = useDatabaseStore()
      try {
        await signOut(auth)
      } catch (error) {
        console.log(error)
      } finally {
        this.userData = null
        this.loadingUser = false
        databaseStore.$reset()
        router.push('/login')
      }
    },

    currentUser() {
      return new Promise((resolve, reject) => {
        const unsubcribe = onAuthStateChanged(
          auth,
          user => {
            const databaseStore = useDatabaseStore()
            if (user) {
              this.userData = { email: user.email, uid: user.uid }
            } else {
              this.userData = null
              databaseStore.$reset()
            }
            resolve(user)
          },
          e => reject(e)
        )
        unsubcribe()
      })
    }
  }
})
