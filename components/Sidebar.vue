<template>
  <div>
    <v-container class="pb-0">
      <v-list-item>
        <v-list-item-title class="title">
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
        <delete-channel :channel="channel" />
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import ChannelForm from '~/components/ChannelForm.vue'
import DeleteChannel from '~/components/DeleteChannel.vue'
import { db } from '~/plugins/firebase'

export default {
  components: {
    ChannelForm,
    DeleteChannel,
  },

  data: () => ({
    channels: [],
    globalOwner: 'DOKODOKOYATTAZE',
  }),

  methods: {
    // 表示するチャンネル検索してchannelsに格納
    queryChannel(id) {
      db.collection('channels').where('owner', '==', id).orderBy('createdAt').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const doc = change.doc
          if(change.type === 'added') {
            this.channels.push({ id: doc.id, ...doc.data() })
          }
        })
      })
    },

    // ログインしているユーザーの作成したチャンネルをchannelsに追加する
    watchChannelChange() {
      this.queryChannel(this.currentUser.uid)
    },

    // 
    deleteChannel() {
      db.collection('channels').doc(channel.id).delete()
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.user
    }
  },

  mounted() {
    if(this.currentUser) {
      this.watchChannelChange()
    } else {
      this.queryChannel(this.globalOwner)
    }
  },

  watch: {
    currentUser() {
      if(this.currentUser) {
        this.watchChannelChange()
      } else {
        this.channels = []
        this.queryChannel(this.globalOwner)
      }
    },
  }
}
</script>