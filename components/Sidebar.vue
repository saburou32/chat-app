<template>
  <v-container class="pa-0">
    <v-list-item class="list-title border">
      <v-list-item-title class="font-weight-bold">
        チャンネル一覧
      </v-list-item-title>
      <create-channel />
    </v-list-item>
    <ul class="pl-0 side-fontSize">
      <li class="pl-4 py-2 side-list">
        <nuxt-link
          to="/"
          class="side-link side_channelcolor--text"
        >
          Home
        </nuxt-link>
      </li>
      <li
        v-for="(channel, index) in channels" :key="index"
        class="pl-4 pr-2 py-1 d-flex justify-space-between side-list"
      >
        <nuxt-link
          :to="`/channels/${ channel.id }`"
          class="side-link side_channelcolor--text"
        >
          # {{ channel.name }}
        </nuxt-link>
        <div class="d-flex">
          <edit-channel :channel="channel" />
          <delete-channel
            :channel="channel"
            class="pl-2"
          />
        </div>
      </li>
    </ul>
  </v-container>
</template>

<script>
import CreateChannel from '~/components/CreateChannel.vue'
import EditChannel from '~/components/EditChannel.vue'
import DeleteChannel from '~/components/DeleteChannel.vue'
import { db } from '~/plugins/firebase'
import { mapGetters } from 'vuex'

export default {
  components: {
    CreateChannel,
    EditChannel,
    DeleteChannel,
  },

  data: () => ({
    channels: [],
    globalOwner: process.env.GLOBAL_CHANNEL_OWNER,
  }),

  methods: {
    // 表示するチャンネル検索してchannelsに格納
    queryChannel(id) {
      db.collection('channels').where('owner', '==', id).orderBy('createdAt').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const doc = change.doc
          if(change.type === 'added') {
            this.channels.push({ id: doc.id, ...doc.data() })
            return
          }

          if(change.type === 'modified') {
            const index = this.channels.findIndex(
              channel => channel.id === doc.id
            )
            this.channels.splice(index, 1, { id: doc.id, ...doc.data() })
            return
          }
          
          if(change.type === 'removed') {
            const index = this.channels.findIndex(
              channel => channel.id === doc.id
            )
            this.channels.splice(index, 1)
            return
          }
        })
      })
    },

    // ログインしているユーザーの作成したチャンネルをchannelsに追加する
    watchChannelChange() {
      this.queryChannel(this.currentUser.uid)
    },
  },

  computed: {
    ...mapGetters(['currentUser']),
  },

  mounted() {
    this.queryChannel(this.globalOwner)
  },

  watch: {
    currentUser() {
      if(this.currentUser) {
        this.watchChannelChange()
      } else {
        this.channels.splice(0)
        this.queryChannel(this.globalOwner)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.list-title {
  height: 64px;
}

.side-fontSize {
  font-size: 15px;
}

.side-list:hover {
  background: #350d36;
}

.side-link {
  display: block;
  width: 100%;
  height: 100%;
}

.side-active {
  background: #1264a3;
}
</style>