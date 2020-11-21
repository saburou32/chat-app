<template>
  <div>
    <v-btn
      outlined
      small
      v-if="!isAuthenticated"
      @click="login"
    >
      ログイン
    </v-btn>
    <v-btn
      outlined
      small
      v-else
      @click="logout"
      to="/"
      nuxt
    >
      ログアウト
    </v-btn>
  </div>
</template>

<script>
import { firebase } from '~/plugins/firebase'
import { mapActions, mapGetters } from 'vuex' 
export default {
  methods: {
    ...mapActions(['setUser']),
      // ログイン、firebaseの認証
    login() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          this.setUser(result.user)
        }).catch((error) => {
          window.alert(error)
        })
    },

    // ログアウト、firebaseの機能
    logout() {
      firebase.auth().signOut()
        .then(() => {
          this.setUser(null)
        }).catch((error) => {
          window.alert(error)
        })
    },
  },
  
  computed: {
    ...mapGetters(['isAuthenticated']),
  }
}
</script>