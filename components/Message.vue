<template>
  <v-row class="mb-2">
    <v-col cols="auto">
      <v-img
        :src="messages.thumbnail"
        width="50px"
        height="50px"
        class="rounded-lg"
      >
      </v-img>
    </v-col>
    <v-col class="py-0">
      <div class="font-weight-bold">{{ messages.user }}</div>
      <div class="message">{{ messages.text }}</div>
    </v-col>
  </v-row>
</template>

<script>
export default {
    data: () => ({
    messages: {
      text: 'あいうえおーーー',
      thumbnail: 'https://pbs.twimg.com/profile_images/1131882065337602049/0JRUGd3S_400x400.jpg',
      user: 'name'
    }
  })
}
</script>