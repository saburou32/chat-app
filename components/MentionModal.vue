<template>
  <v-list
    width="100vw"
    max-height="200"
    max-width="800"
  >
    <v-list-item
      v-for="channelMember in channelMembers"
      :key="channelMember.userId"
      dense
      link
      @click="sendMentionUser(channelMember.displayName)"
    >
      <v-list-item-avatar
        :tile="true"
        size="20"
        class="my-2 mr-2"
      >
        <v-img
          :src="channelMember.userIcon"
        ></v-img>
      </v-list-item-avatar>
      <v-list-item-content class="py-2">
        <v-list-item-title class="subtitle-2 font-weight-bold">
          {{ channelMember.displayName }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    channelMembers: Array,
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