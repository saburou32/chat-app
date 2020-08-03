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
    <v-icon>mdi-delete</v-icon>
  </v-btn>
  <v-dialog v-model="modalVisible" max-width="400">
    <v-card>
      <v-card-title class="title">{{ channel.name }}を削除</v-card-title>
      <v-card-text class="body-1 red--text pb-0">
        一度削除したら取り消せません。<br>
        本当に削除しますか？
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="deleteChannel">
          YES
        </v-btn>
        <v-btn text color="primary" @click="modalVisible = false">
          NO
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
    owner: false,
    modalVisible: false,
  }),

  methods: {
    deleteChannel() {
      if(this.isAuthenticated) {
        db.collection('channels').doc(this.channel.id).delete()
        location.href = '/'
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

    isOwner() {
      if(this.currentUser) {
        return this.currentUser.uid === this.channel.owner
      } else {
        return false
      }
    }
  },
}
</script>