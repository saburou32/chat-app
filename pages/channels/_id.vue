<template>
  <v-container fluid>
    <v-row class="container pt-0 mx-auto">
      <v-col cols="12" class="messages-col">
        <messages :messages="messages" />
      </v-col>
      <v-col cols="12" align-self="end" height="auto" class="pb-0">
        <chat-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Messages from '~/components/Messages.vue'
import ChatForm from '~/components/ChatForm.vue'
import { db } from '~/plugins/firebase'

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
    const channelId = this.$route.params.id
    db.collection('channels').doc(channelId).collection('messages').orderBy('createdAt')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const doc = change.doc
        if(change.type === 'added'){
          this.messages.push({ id: doc.id, ...doc.data() })
        }
      })
    })
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}

.messages-col {
  max-height: 80%;
  overflow: scroll;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 9999;
}
</style>