<template>
  <v-container fluid>
    <v-row class="container pt-0">
      <v-col cols="12">
        <messages />
      </v-col>
      <v-col cols="12" align-self="end" height="auto" class="pb-0">
        <chat-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Messages from '~/components/Messages.vue'
import ChatForm from '~/components/ChatForm.vue'

export default {
  components: {
    Messages,
    ChatForm
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  max-width: 100%;
}
</style>