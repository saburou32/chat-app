<template>
  <v-row>
    <v-col cols="auto pb-0" height="auto">
      <v-img
        :src="currentUser.photoURL"
        v-if="isAuthenticated"
        width="12vw"
        height="12vw"
        max-width="50px"
        max-height="50px"
        class="rounded-lg"
      >
      </v-img>
    </v-col>
    <v-col height="auto" class="pb-0">
      <v-form ref="chat_form">
        <v-textarea
          outlined
          auto-grow
          rows="1"
          v-model="text"
          :disabled="!isAuthenticated"
          @keydown.exact.ctrl.enter="addMessage"
        >
        </v-textarea>
      </v-form>
      <v-row>
        <v-btn block @click="addMessage" v-if="isAuthenticated">send</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { db, firebase } from '~/plugins/firebase'

export default {
  data: () => ({
    text: null,
  }),

  computed: {
    currentUser() {
      return this.$store.state.user
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },

  methods: {
    // メッセージ保存
    async addMessage() {
      if(this.text && this.isAuthenticated) {
        const channelId = this.$route.params.id
        await db.collection('channels').doc(channelId).collection('messages').add({
          text: this.text,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
          userId: this.currentUser.uid
        })
        this.text = null
      } else if(!this.text) {
        window.alert('1文字以上は入力してください')
      }
    }
  }
}
</script>
