<template>
  <v-container fluid>
    <v-row align="center">
      <v-card class="mx-auto home-container mt-12">
        <v-card-title class="headline font-weight-bold">Home</v-card-title>
        <v-card-subtitle>VuetifyとNuxtを使ってみたくて作ってみた簡単なチャットアプリです。</v-card-subtitle>
        <v-card-text class="black--text">
          チャットの書き込みをしたい場合はログインボタンからGoogleアカウントでログインしてください。<br>
          チャンネル一覧には自分が作成したチャンネルとGlobalチャンネルが表示されます。<br>
          Globalチャンネルは誰でも好きにチャットできるので気軽に書き込んでください。
        </v-card-text>
        <v-card-subtitle class="black--text font-weight-bold subtitle-1 pb-0">
          ユーザ作成チャンネルについて
        </v-card-subtitle>
        <v-card-text class="black--text">
          チャンネル一覧の隣のプラスマークからチャンネルを作成できます。<br>
          (見えない場合はハンバーガーメニューをクリックしてください)<br>
          自分のチャンネルに人を呼びたい場合や、人のチャンネルに行きたい時は<br>
          チャンネルのURLを共有し、アクセスしてください。<br>
        </v-card-text>
        <v-card-subtitle class="black--text font-weight-bold subtitle-1 pb-0">
          注意点
        </v-card-subtitle>
        <v-card-text class="black--text">
          URLさえ分かれば誰でも入ってこれるので、URLの公開範囲には気をつけてください。<br>
          また、チャンネルは1人につき5つまでしか作れないので、適宜整理してください。
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    methods: {
      // this.$store.dispatchをスプレッド構文で組み込み
      ...mapActions([
        'setChannelId',
        'setChannelName',
        'setChannelMembers',
      ]),
    },

    mounted() {
      this.setChannelId(null)
      this.setChannelName(null)
      this.setChannelMembers(null)
    }
  }
</script>