<template>
  <v-row>
    <v-col cols="auto pb-0" height="auto">
      <v-img
        :src="`https://pbs.twimg.com/profile_images/1131882065337602049/0JRUGd3S_400x400.jpg`"
        width="12vw"
        height="12vw"
        max-width="50px"
        max-height="50px"
        class="rounded-lg"
      >
      </v-img>
    </v-col>
    <v-col height="auto" class="pb-0">
      <v-textarea outlined auto-grow rows="1" v-model="text" v-if="isAuthenticated"></v-textarea>
      <v-textarea outlined auto-grow rows="1" v-model="text" v-else></v-textarea>
      <v-row>
        <v-btn block>send</v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    isAuthenticated: true,
    text: '',
  })
}
</script>

<style scoped>

</style>