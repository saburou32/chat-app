<template>
  <v-app id="inspire">
    <v-navigation-drawer class="elevation-6" v-model="drawer" color="primary" app dark>
      <v-container class="pb-0">
        <v-list-item>
            <v-list-item-title class="title" @click="test">
              チャンネル一覧
            </v-list-item-title>
          <channel-form />
        </v-list-item>
        <v-divider></v-divider>
      </v-container>
      <v-list nav>
        <v-list-item link to="/" nuxt>
          Home
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          class="mb-0"
          link
          nuxt
          :to="`/channels/${ channel.id }`"
          v-for="(channel, index) in channels" :key="index"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ channel.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="blue" dark ref="header">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>チャンネル名</v-toolbar-title>
      <v-spacer></v-spacer>
      <auth-btn />
    </v-app-bar>

    <v-main class="main-container">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import ChannelForm from '~/components/ChannelForm.vue'
import AuthBtn from '~/components/AuthBtn.vue'
import { db, firebase } from '~/plugins/firebase'
import { mapActions } from 'vuex'

export default {
  props: {
    source: String,
  },
  components: {
    ChannelForm,
    AuthBtn
  },
  data: () => ({
    drawer: null,
    channels: [],
    currentId: ['DOKODOKOYATTAZE'],
  }),

  methods: {
    ...mapActions(['setUser']),

    test() {
      console.log(this.$store.state.user.uid)
    }
  },

  mounted() {
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
    db.collection('channels').orderBy('createdAt').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const doc = change.doc
        if(change.type === 'added') {
          this.channels.push({ id: doc.id, ...doc.data() })
        }
      })
    })
  }
}
</script>

<style scoped>
.main-container {
  height: 100vh;
  background: #eeeeef;
}
</style>