<template>
  <div>
    <v-btn
      x-small
      text
      min-width="0"
      @click="modalVisible = !modalVisible"
      class="px-1"
    >
      <v-icon
        size="20"
        color="#555"
      >
        mdi-delete
      </v-icon>
    </v-btn>
    <v-dialog v-model="modalVisible" max-width="400">
      <v-card>
        <v-card-title class="title">メッセージを削除</v-card-title>
        <v-card-text class="body-1 red--text pb-0">
          一度削除したら取り消せません。<br>
          本当に削除しますか？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="deleteMessage">
            YES
          </v-btn>
          <v-btn text color="primary" @click="modalVisible = false">
            NO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from '~/plugins/firebase'

export default {
  props: {
    message: Object,
    channelId: String,
  },

  data: () => ({
    modalVisible: false,
  }),

  methods: {
    async deleteMessage() {
      if(!this.isAuthenticated || !this.currentUser.uid === this.message.uid) {
        window.alert('メッセージの削除に失敗しました')
        return
      }
      if(this.currentUser.uid === this.message.userId) {
        await db.collection('channels').doc(this.channelId).collection('messages').doc(this.message.id).delete()
      }
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.user
    },

    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  },
}
</script>