<template>
  <v-app id="inspire">
    <v-system-bar
      app
      dark
      height="38px"
      color="header"
    >
      <v-spacer></v-spacer>
      <auth-btn />
    </v-system-bar>
    <v-navigation-drawer
      app
      dark
      color="sidetheme"
      v-model="drawer"
      mobile-breakpoint="900"
    >
      <sidebar />
    </v-navigation-drawer>
    <v-app-bar
      app
      flat
      dense
      height="64px"
      class="bg-white border-bottom"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ currentChannelName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <member-list />
    </v-app-bar>
    <v-main light>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'
import AuthBtn from '~/components/AuthBtn.vue'
import MemberList from '~/components/MemberList.vue'
import { db, firebase } from '~/plugins/firebase'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Sidebar,
    AuthBtn
  },

  data: () => ({
    drawer: null,
    channelName: '',
  }),

  methods: {
    // this.$store.dispatchをスプレッド構文で組み込み
    ...mapActions(['setUser']),
  },

  computed: {
    // this.$store.gettersをスプレッド構文で組み込み
    ...mapGetters(['currentChannelName',]),
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

.bg-white {
  background-color: #fff;
}
</style>