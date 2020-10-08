<template>
  <v-row class="mb-2">
    <v-col cols="auto">
      <v-img
        :src="user.userIcon"
        width="50px"
        height="50px"
        class="rounded-lg"
      >
      </v-img>
    </v-col>
    <v-col>
      <div class="font-weight-bold">{{ user.displayName }}</div>
      <div class="message">{{ message.text }}</div>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '~/plugins/firebase'

export default {
  props: {
    message: Object,
  },

  data: () => ({
    user: {
      id: '',
      displayName: '',
      userIcom: '',
    }
  }),

  async mounted() {
    // messageのuserIdからusersコレクションのユーザー情報を持ってくる
    const userId = this.message.userId
    const doc = await db.collection('users').doc(userId).get()
    this.user = { id: userId, ...doc.data() }
  }
}
</script>