<template>
  <v-container fluid>
    <v-row align="center">
      <v-card class="mx-auto home-container mt-12">
        <v-card-title class="headline">Home</v-card-title>
        <v-card-subtitle>VuetifyとNuxtを使ってみたくて作ってみた簡単なチャットアプリです。</v-card-subtitle>
        <v-card-text class="black--text">
          チャットの書き込みをしたい場合はログインボタンからGoogleアカウントでログインしてください。<br>
          ログイン後、画面左のプラスマークからチャンネルの作成ができます。<br>
          作成できるチャンネル数は一人5つまでです。<br>
          画面左のナビゲーションからチャンネルを選択するとチャット画面に遷移します。<br>
          画面下に表示されるテキストフォームからチャットの投稿ができます。
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
