<template>
  <v-container class="message-container py-0 px-5">
    <v-row class="mx-0">
      <v-col cols="auto pl-0">
        <v-img
          :src="user.userIcon"
          width="36"
          height="36"
          class="rounded"
        >
        </v-img>
      </v-col>
      <v-col class="px-0 pt-2">
        <div class="body-2">
          <p class="font-weight-bold mb-0">{{ user.displayName }}</p>
          <div class="accordion__container pa-1" v-if="isContributor">
            <edit-message :message="message" />
            <delete-message :message="message" />
          </div>
        </div>
        <div class="message-text">{{ message.text }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '~/plugins/firebase'
import { mapGetters } from 'vuex'
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
  }),
  
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'currentUser',
    ]),

    isContributor() {
      if(!this.isAuthenticated) return
      return this.currentUser.uid === this.message.userId
    }
  },

  async mounted() {
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
  }
}

.message-text {
  font-size: 14px;
  white-space: pre-line;
}
</style>