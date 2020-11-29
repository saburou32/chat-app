<template>
  <v-dialog
    v-model="modalVisible"
    max-width="800"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        text
        x-small
        min-width="0"
        v-if="isOwner"
        v-on="on"
        class="px-0"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
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
</template>

<script>
import { db } from '~/plugins/firebase'
import { mapGetters } from 'vuex'

export default {
  props: {
    channel: {
      name: String,
      owner: String,
      createdAt: Number,
      updatedAt: Number,
    }
  },

  data: () => ({
    modalVisible: false,
    channelName: '',
    channelRules: value => !!value || "チャンネル名は入力必須です",
  }),

  methods: {
    async editChannel() {
      if(!this.isAuthenticated) return
      if(!this.currentUser.uid === this.channel.owner) return
      if(!this.$refs.channel_form.validate()) {
        window.alert('チャンネル名は1文字以上必須です')
        return
      }

      if(this.$refs.channel_form.validate()) {
        await db.collection('channels').doc(this.channel.id).update({
          name: this.channelName
        })
        this.modalVisible = false
      }
    },
  },

  computed: {
    // this.$store.gettersをスプレッド構文で組み込み
    ...mapGetters([
      'isAuthenticated',
      'currentUser',
    ]),

    isOwner() {
      if(!this.isAuthenticated) return
      return this.currentUser.uid === this.channel.owner
    }
  },

  mounted() {
    this.channelName = this.channel.name
  }
}
</script>