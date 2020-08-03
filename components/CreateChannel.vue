<template>
<v-dialog v-model="modalVisible" max-width="800" v-if="isAuthenticated">
  <template v-slot:activator="{ on }">
    <v-btn text x-small v-on="on">
      <v-icon dense>mdi-plus</v-icon>
    </v-btn>
  </template>
  <v-card>
    <v-card-title class="title">チャンネル作成</v-card-title>
    <v-card-subtitle>作成したいチャンネルの名前を入力してください</v-card-subtitle>
    <v-card-text class="pb-0">
      <v-form ref="channel_form" @submit.prevent>
        <v-text-field
          label="Channel name"
          v-model="channelName"
          :rules="[channelRules]"
          @keydown.exact.ctrl.enter="createChannel"
        >
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        class="mr-4"
        @click="createChannel"
        text
        color="primary"
      >
      creat
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import { db } from '~/plugins/firebase'

export default {
  data: () => ({
    modalVisible: false,
    channelName: '',
    channelRules: value => !!value || "チャンネル名は入力必須です",
    createdChannelCount: '',
  }),

  methods: {
    async createChannel() {
      this.fetchCreatedCount()
      if(this.$refs.channel_form.validate() && this.isAuthenticated && this.createdChannelCount < 4 ) {
        await db.collection('channels').add({
          name: this.channelName,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
          owner: this.currentUser.uid
        })
        this.channelName = ''
        this.$refs.channel_form.resetValidation()
        this.modalVisible = false
      } else if(!this.$refs.channel_form.validate()) {
        window.alert('チャンネル名は1文字以上必須です')
      } else if(this.createdChannelCount > 4) {
        window.alert('1つのアカウントで作れるチャンネル数は5つまでです')
      }
    },

    async fetchCreatedCount() {
      const currentUserId = this.currentUser.uid
      const snapshot = await db.collection('channels').where('owner', '==', currentUserId).get()
      this.createdChannelCount = snapshot.size
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.user
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
}
</script>