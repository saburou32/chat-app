<template>
  <v-dialog
    v-model="modalVisible"
    max-width="520"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        text
        x-small
        min-width="0"
        v-if="isOwner"
        v-on="on"
        class="px-0 ml-2"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title">{{ channel.name }}を削除</v-card-title>
      <v-card-text class="body-1 red--text pb-0">
        一度削除したら取り消せません。<br>
        本当に削除しますか？
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          @click="deleteChannel"
        >
          YES
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="modalVisible = false"
        >
          NO
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
  }),

  methods: {
    async deleteChannel() {
      if(!this.isAuthenticated || !this.currentUser.uid === this.channel.owner) {
        window.alert('チャンネルの削除に失敗しました')
        return
      }
      
      if(this.currentUser.uid === this.channel.owner) {
        await db.collection('channels').doc(this.channel.id).delete()
        this.modalVisible = false
        this.$router.push('/')
      }
    }
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
}
</script>