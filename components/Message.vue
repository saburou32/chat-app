<template>
  <v-row class="mb-2">
    <v-col cols="auto">
      <v-img
        :src="user.userIcon"
        width="12vw"
        height="12vw"
        max-width="50"
        max-height="50"
        class="rounded-lg"
      >
      </v-img>
    </v-col>
    <v-col class="px-0 pt-2">
      <div class="font-weight-bold body-1">{{ user.displayName }}</div>
      <div class="body-2">{{ message.text }}</div>
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