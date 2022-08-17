import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { defineStore } from 'pinia'
import { auth, db } from '../firebaseConfig'
import { nanoid } from 'nanoid'

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    documents: [],
    loading: false,
    loadingDoc: false,
    collectionName: 'urls'
  }),
  actions: {
    async getUrls() {
      if (this.documents.length !== 0) {
        return
      }

      this.loading = true
      this.documents = []
      const q = query(
        collection(db, this.collectionName),
        where('user', '==', auth.currentUser.uid)
      )

      try {
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(doc => {
          this.documents.push({ id: doc.id, ...doc.data() })
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async addUrl(name) {
      this.loadingDoc = true
      try {
        const docObject = {
          name: name,
          short: nanoid(5),
          user: auth.currentUser.uid
        }
        await setDoc(doc(db, this.collectionName, docObject.short), docObject)
        this.documents.push({ ...docObject, id: docObject.short })
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingDoc = false
      }
    },

    async removeUrl(id) {
      this.loadingDoc = true
      try {
        const docRef = doc(db, this.collectionName, id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          throw new Error('O documento não existe')
        }

        if (docSnap.data().user === auth.currentUser.uid) {
          await deleteDoc(docRef)
          this.documents = this.documents.filter(item => item.id != id)
        } else {
          throw new Error('Acesso negado')
        }
      } catch (error) {
        console.log(error.message)
      } finally {
        this.loadingDoc = false
      }
    },

    async getUrl(id) {
      this.loadingDoc = true
      try {
        const docRef = doc(db, this.collectionName, id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          throw new Error('O documento não existe')
        }

        if (docSnap.data().user === auth.currentUser.uid) {
          return docSnap.data().name
        } else {
          throw new Error('Acesso negado')
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingDoc = false
      }
    },

    async updateUrl(id, name) {
      this.loadingDoc = true
      try {
        const docRef = doc(db, this.collectionName, id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          throw new Error('O documento não existe')
        }

        if (docSnap.data().user === auth.currentUser.uid) {
          await updateDoc(docRef, {
            name: name
          })
          this.documents = this.documents.map(item =>
            item.id === id ? { ...item, name: name } : item
          )
        } else {
          throw new Error('Acesso negado')
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingDoc = false
      }
    },

    async searchURL(id) {
      try {
        const docRef = doc(db, this.collectionName, id)
        const docSpan = await getDoc(docRef)
        if (!docSpan.exists()) {
          return false
        }
        window.location.href = docSpan.data().name
        return docSpan.data().name
      } catch (error) {
        console.log(error)
        return false
      } finally {
      }
    }
  }
})
