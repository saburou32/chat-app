<template>
  <v-app id="inspire">
    <v-navigation-drawer class="elevation-6" v-model="drawer" color="primary" app dark>
      <v-container>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              チャンネル一覧
            </v-list-item-title>
          </v-list-item-content>
          <v-btn text x-small>
            <v-icon dense>mdi-plus</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider></v-divider>
      </v-container>
      <v-list nav>
        <v-list-item link to="/">
          Home
        </v-list-item>
        <v-list-item
          link
          nuxt
          :to="`/channels/${ channel.id }`"
          v-for="channel in channels" :key="channel.name"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ channel.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark ref="header">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>チャンネル名</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outlined v-if="!isAuthenticated" @click="login">ログイン</v-btn>
      <v-btn outlined v-else @click="logout">ログアウト</v-btn>
    </v-app-bar>

    <v-main class="main-container">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { db, firebase } from '~/plugins/firebase'
import { mapActions } from 'vuex'

export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    channels: [],
  }),

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
    }
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },

  async mounted() {
    // 認証状態が変化した時、ログインしたユーザー情報からusersコレクションを作成する
    // また、認証状態を保持する
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setUser(user)
        db.collection('users').doc(user.uid).set({
          userId: user.uid,
          displayName: user.displayName,
          userIcon: user.photoURL,
          createdAt: new Date().getTime(),
          updateAt: new Date().getTime()
        })
      }
    })
    // チャンネル取得
    const snapshot = await db.collection('channels').get()
    snapshot.forEach((doc) => {
      this.channels.push({ id: doc.id, ...doc.data() })
    })
  }
}
</script>

<style scoped>
.main-container {
  height: 100vh;
}
</style>