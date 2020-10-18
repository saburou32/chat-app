<template>
  <v-container fluid class="chat-container">
    <v-row class="flex-column chat-container">
      <v-col class="chat-messages">
        <messages :messages="messages" />
      </v-col>
      <v-col class="flex-grow-0">
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
  }),

  mounted() {
    // 投稿の監視、ブラウザリロードなしでチャット更新
    this.channelId = this.$route.params.id
    db.collection('channels').doc(this.channelId).collection('messages').orderBy('createdAt')
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
  }
}
</script>

<style lang="scss" scoped>
.chat-container {
  height: 100%;
}

.chat-messages {
  overflow: scroll;
}
</style>