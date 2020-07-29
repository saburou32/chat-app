<template>
  <v-app id="inspire">
    <v-navigation-drawer class="elevation-6" v-model="drawer" color="primary" app dark>
      <v-container>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              チャンネル一覧
            </v-list-item-title>
          </v-list-item-content>
          <v-btn text x-small>
            <v-icon dense>mdi-plus</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider></v-divider>
      </v-container>
      <v-list dense nav>
        <!-- <v-subheader class="pl-4" short>チャンネル一覧</v-subheader> -->
        <v-list-item link v-for="(channel, index) in channels" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ channel }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>チャンネル名</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outlined v-if="isAuthenticated">ログイン</v-btn>
      <v-btn outlined v-else>ログアウト</v-btn>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      channels: [
        'チャンネル1',
        'チャンネル2'
      ],
      isAuthenticated: true,
    }),
  }
</script>