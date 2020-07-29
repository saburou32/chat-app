<template>
  <div class="chats-container">
    <message />
    <message />
  </div>
</template>

<script>
import Message from '~/components/Message.vue'

export default {
  components: {
    Message
  },
}
</script>

<style scoped>
.chats-container {
  overflow: scroll;
}
</style>