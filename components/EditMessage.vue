<template>
  <v-dialog
    v-model="modalVisible"
    max-width="800"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        x-small
        text
        min-width="0"
        v-on="on"
        class="px-1"
      >
        <v-icon
          size="20"
          color="#555"
        >
          mdi-pencil
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>メッセージ編集</v-card-title>
      <v-card-text class="pb-0">
        <v-form ref="message_form" @submit.prevent>
          <v-textarea
            label="Message text"
            v-model="messageText"
            :rules="[messageRules]"
            @keydown.exact.ctrl.enter="editMessage"
          >
          </v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-4"
          @click="editMessage"
          text
          color="primary"
        >
        change
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from '~/plugins/firebase'
import { mapGetters } from 'vuex'

export default {
  props: {
    message: Object,
  },

  data: () => ({
    modalVisible: false,
    messageText: '',
    messageRules: value => !!value || "メッセージ内容は入力必須です",
  }),

  methods: {
    async editMessage() {
      if(!this.isAuthenticated) return
      if(!this.currentUser.uid === this.message.userId) return
      if(!this.$refs.message_form.validate()) {
        window.alert('チャンネル名は1文字以上必須です')
        return
      }
      
      if(this.$refs.message_form.validate()) {
        await db.collection('channels').doc(this.currentChannel).collection('messages').doc(this.message.id).update({
          text: this.messageText
        })
        this.modalVisible = false
      }
    },
  },

  computed: {
    ...mapGetters([
      'isAuthenticated',
      'currentUser',
      'currentChannel',
    ]),
  },

  mounted() {
    this.messageText = this.message.text
  }

}
</script>