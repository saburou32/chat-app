<template>
  <v-container>
    <v-row class="message-container">
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
        <div>
          <p class="font-weight-bold body-1 mb-0">{{ user.displayName }}</p>
          <div class="accordion__container pa-1" v-if="isContributor">
            <edit-message :message="message" :channelId="channelId" />
            <delete-message :message="message" :channelId="channelId" />
          </div>
        </div>
        <div class="body-2">{{ message.text }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '~/plugins/firebase'
import EditMessage from '~/components/EditMessage.vue'
import DeleteMessage from '~/components/DeleteMessage.vue'

export default {
  props: {
    message: Object,
  },

  components: {
    EditMessage,
    DeleteMessage,
  },

  data: () => ({
    user: {
      id: '',
      displayName: '',
      userIcom: '',
    },
    channelId: '',
  }),
  
  computed: {
    currentUser() {
      return this.$store.state.user
    },

    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },

    isContributor() {
      if(!this.isAuthenticated) return
      return this.currentUser.uid === this.message.userId
    }
  },

  async mounted() {
    this.channelId = this.$route.params.id
    // messageのuserIdからusersコレクションのユーザー情報を持ってくる
    const userId = this.message.userId
    const doc = await db.collection('users').doc(userId).get()
    this.user = { id: userId, ...doc.data() }
  }
}
</script>

<style lang="scss" scoped>
.message-container {
  position: relative;
  border-radius: 5px;
  transition: 0.3s;
  &:hover {
    background: #ddd;
    & .accordion__container {
      opacity: 1;
      visibility: visible;
    }
  }
}

.accordion {
  &__container {
    display: flex;
    position: absolute;
    top: -10px;
    right: 10px;
    background: #fff;
    border: 1px solid #dfdfdf;
    border-radius: 5px;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
  }

}
</style>