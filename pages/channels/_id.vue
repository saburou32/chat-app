<template>
  <v-container fluid class="channel-container py-0">
    <v-row
      ref="message"
      class="chat-messages chat-flex-basis"
    >
      <v-col class="px-0">
        <messages :messages="messages" />
      </v-col>
    </v-row>
    <v-row class="chat-flex-basis flex-grow-0">
      <v-col class="pb-0 px-0">
        <chat-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Messages from '~/components/Messages.vue'
import ChatForm from '~/components/ChatForm.vue'
import { db } from '~/plugins/firebase'
import { mapActions } from 'vuex'

export default {
  components: {
    Messages,
    ChatForm
  },

  data: () => ({
    messages: [],
    memberList: [],
    channelMembers: [],
  }),

  methods: {
    // this.$store.dispatchをスプレッド構文で組み込み
    ...mapActions([
      'setChannelId',
      'setChannelName',
      'setChannelMembers',
    ]),

    async memberListQuery() {
      this.channelMembers.splice(0)
      for(const elem of this.memberList) {
        const userRef = await db.collection('users').where('userId', '==', elem).get()
        userRef.forEach(doc => {
          if(!doc.exists) return
          this.channelMembers.push({ ...doc.data() })
        })
      }
      this.setChannelMembers(this.channelMembers)
    },

    scrollEnd() {
      this.$nextTick(() => {
        const messageTarget = this.$refs.message
        if(!messageTarget) return 
        messageTarget.scrollTop = messageTarget.scrollHeight
      })
    }
  },

  async mounted() {
    // マウント時にチャンネル情報をvuexへセット
    this.setChannelId(this.$route.params.id)
    const channelRef = await db.collection('channels').doc(this.$route.params.id)
    channelRef.get()
      .then(doc => {
        if(!doc.exists) {
          window.alert('申し訳ありませんが、開こうとしたチャンネルは存在しないようです')
          this.$router.push('/')
        } else {
          this.setChannelName(doc.data().name)
        }
      })
      .catch((error) => {
        window.alert(error)
      })

    // 投稿の監視、ブラウザリロードなしでチャット更新
    channelRef.collection('messages').orderBy('createdAt')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const doc = change.doc
        if(change.type === 'added'){
          this.messages.push({ id: doc.id, ...doc.data() })
          return
        }

        if(change.type === 'modified') {
          const index = this.messages.findIndex(
            message => message.id === doc.id
          )
          this.messages.splice(index, 1, { id: doc.id, ...doc.data() })
          return
        }
        
        if(change.type === 'removed') {
          const index = this.messages.findIndex(
            message => message.id === doc.id
          )
          this.messages.splice(index, 1)
          return
        }
      })
    })

    // チャンネル参加者一覧クエリ
    channelRef.collection('memberList')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const doc = change.doc
        if(change.type === 'added'){
          this.memberList.push(doc.id)
          return
        }
        
        if(change.type === 'removed') {
          const index = this.memberList.findIndex(
            memberList => member.id === doc.id
          )
          this.memberList.splice(index, 1)
          return
        }
      })
    })
  },

  watch: {
    memberList: function() {
      this.memberListQuery()
    },
  },

  updated() {
    this.scrollEnd()
  },
}
</script>

<style lang="scss" scoped>
.channel-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
}

.chat-flex-basis {
  flex-basis: 0;
}

.chat-messages {
  overflow-y: scroll;
}
</style>