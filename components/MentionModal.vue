<template>
  <v-list
    width="100vw"
    max-height="200"
    max-width="800"
  >
    <v-list-item
      v-for="candidateUser in candidateUsers"
      :key="candidateUser.userId"
      dense
      link
      @click="sendMentionUser(candidateUser.displayName)"
    >
      <v-list-item-avatar
        :tile="true"
        size="20"
        class="my-2 mr-2"
      >
        <v-img
          :src="candidateUser.userIcon"
        ></v-img>
      </v-list-item-avatar>
      <v-list-item-content class="py-2">
        <v-list-item-title class="subtitle-2 font-weight-bold">
          {{ candidateUser.displayName }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    candidateUsers: Array,
  },

  data: () => ({
    mentionUser: '',
  }),

  methods: {
    sendMentionUser(name) {
      this.$emit('catchMentionUser', name)
    }
  },

}
</script>