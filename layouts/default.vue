<template>
  <v-app id="inspire">
    <v-navigation-drawer class="elevation-6" v-model="drawer" color="primary" app dark>
      <sidebar />
    </v-navigation-drawer>

    <v-app-bar app color="blue" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>チャットルーム</v-toolbar-title>
      <v-spacer></v-spacer>
      <auth-btn />
    </v-app-bar>

    <v-main class="main-container">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import AuthBtn from '~/components/AuthBtn.vue'
import { db, firebase } from '~/plugins/firebase'
import { mapActions } from 'vuex'

export default {
  props: {
    source: String,
  },
  components: {
    Sidebar,
    AuthBtn
  },
  data: () => ({
    drawer: null,
  }),

  methods: {
    ...mapActions(['setUser']),
  },

  async mounted() {
    // 認証状態が変化した時、ログインしたユーザー情報からusersコレクションを作成する
    // また、認証状態を保持する
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setUser(user)
          db.collection('users').doc(user.uid).set({
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          userIcon: user.photoURL,
          createdAt: new Date().getTime(),
          updateAt: new Date().getTime()
        })
      }
    })
  }
}
</script>

<style scoped>
.main-container {
  height: 100vh;
}
</style>