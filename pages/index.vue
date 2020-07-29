<template>
  <v-container fluid>
    <v-row align="center">
      <v-card class="mx-auto home-container mt-12">
        <v-card-title class="headline">Home</v-card-title>
        <v-card-subtitle>VuetifyとNuxtを使ってみたくて作ってみた簡単なチャットアプリです。</v-card-subtitle>
        <v-card-text class="black--text">
          画面左のナビゲーションからチャンネルを選択するとチャット画面に遷移します。<br>
          チャットの書き込みをしたい場合はログインボタンからGoogleアカウントでログインしてください。<br>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {
  }
}
</script>
