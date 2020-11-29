<template>
  <div>
    <message
      v-for="message in messages"
      :key="message.id"
      :message="message"
    />
  </div>
</template>

<script>
import Message from '~/components/Message.vue'

export default {
  props: {
    messages: Array,
  },

  components: {
    Message,
  },
}
</script>