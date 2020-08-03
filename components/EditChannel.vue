<template>
<v-list-item-action>
  <v-btn
    class="px-0"
    @click.stop.prevent="modalVisible = true"
    text
    small
    min-width="0"
    v-if="isOwner"
  >
  <v-icon>mdi-pencil</v-icon>
  </v-btn>
  <v-dialog v-model="modalVisible" max-width="800">
    <v-card>
      <v-card-title class="title">{{ channel.name }}</v-card-title>
      <v-card-subtitle>変更したい名前を入力してください</v-card-subtitle>
      <v-card-text class="pb-0">
        <v-form ref="channel_form" @submit.prevent>
          <v-text-field
            label="Channel name"
            v-model="channelName"
            :rules="[channelRules]"
            @keydown.exact.ctrl.enter="editChannel"
          >
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-4"
          @click="editChannel"
          text
          color="primary"
        >
        change
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-list-item-action>
</template>

<script>
import { db } from '~/plugins/firebase'

export default {
  props: ['channel'],

  data: () => ({
    modalVisible: false,
    channelName: '',
    channelRules: value => !!value || "チャンネル名は入力必須です",
  }),

  methods: {
    async editChannel() {
      if(this.$refs.channel_form.validate() && this.isAuthenticated ) {
        await db.collection('channels').doc(this.channel.id).update({
          name: this.channelName
        })
        this.modalVisible = false
        location.href = `/channels/${ this.channel.id }`
      } else if(!this.$refs.channel_form.validate()) {
        window.alert('チャンネル名は1文字以上必須です')
      }
    },
  },

  computed: {
    currentUser() {
      return this.$store.state.user
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },

    isOwner() {
      if(this.currentUser) {
        return this.currentUser.uid === this.channel.owner
      } else {
        return false
      }
    }
  },

  mounted() {
    this.channelName = this.channel.name
  }
}
</script>