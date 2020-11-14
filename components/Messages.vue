<template>
  <div ref="message">
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

  methods: {
    scrollEnd() {
      this.$nextTick(() => {
        const messageTarget = this.$refs.message
        if(!messageTarget) return 
        messageTarget.scrollIntoView(false)
      })
    }
  },

  updated() {
    this.scrollEnd()
  },
}
</script>