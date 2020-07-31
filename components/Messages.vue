<template>
  <div class="messages-container">
    <message v-for="message in messages" :key="message.id" :message="message" />
  </div>
</template>

<script>
import Message from '~/components/Message.vue'

export default {
  props: ['messages'],

  components: {
    Message
  },

  mounted() {
    // messageが多くてスクロールできる場合、一番下のメッセージが見えるように表示する
    let target = this.$el
    target.scrollIntoView(false)
  },
}
</script>