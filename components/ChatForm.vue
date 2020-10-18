<template>
  <v-container class="column">
    <v-row>
      <v-col cols="auto" class="pb-0">
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
      <v-col class="pb-0">
        <v-form ref="chat_form">
          <v-textarea
            outlined
            rows="1"
            auto-grow
            v-model="text"
            :disabled="!isAuthenticated"
            @keydown.exact.ctrl.enter="addMessage"
          >
          </v-textarea>
        </v-form>
      </v-col>
    </v-row>
    <v-row class="my-n2 px-3">
      <v-btn block @click="addMessage" v-if="isAuthenticated">send</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { db, firebase } from '~/plugins/firebase'

export default {
  data: () => ({
    text: '',
    currentChannel: ''
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
      if(!this.isAuthenticated) return
      if(!this.text) {
        window.alert('1文字以上は入力してください')
        return
      }
      
      if(this.text) {
        const channelId = this.$route.params.id
        const channelRef = await db.collection('channels').doc(channelId)
        await channelRef.get()
          .then(doc => {
            if(!doc.exists) {
              window.alert('メッセージを投稿しようとしたチャンネルは存在しません')
              this.$router.push('/')
              return
            } else {
              channelRef.collection('messages').add({
                text: this.text,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
                userId: this.currentUser.uid
              })
              this.text = null
              channelRef.update({
                joinMembsers: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
              })
            }
          })
          .catch((error) => {
            window.alert(error)
          })
      }
    },
  },
}
</script>
