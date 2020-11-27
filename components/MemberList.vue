<template>
  <v-dialog
    v-model="modalVisible"
    max-width="520"
  >
    <template v-slot:activator="{ on }">
      <div
        v-on="on"
        class="d-flex align-center mr-2 memberContainer"
      >
        <v-img
          v-for="(displayMember, index) in displayMembers"
          :key="displayMember.userId"
          :src="displayMember.userIcon"
          width="24"
          height="24"
          :class="`displayIconZ-${index + 1}`"
          class="rounded displayIcon mr-n1"
        >
        </v-img>
        <span class="memberLength body-2 rounded">{{ membersLength }}</span>
      </div>
    </template>
    <v-card
      max-height="520"
      height="80vh"
    >
      <v-card-title class="font-weight-bold pl-7 pt-5">
        #{{ currentChannelName }}のメンバー数: {{ membersLength }}名
      </v-card-title>
      <v-btn
        text
        absolute
        top
        right
        min-width="0"
        class="px-2"
        @click="modalVisible = false"
      >
        <v-icon color="rgba(29, 28, 29, 0.7)">mdi-close</v-icon>
      </v-btn>
      <v-list class="memberList">
        <v-list-item
          link
          v-for="currentChannelMember in currentChannelMembers"
          :key="currentChannelMember.userId"
          class="px-9"
        >
        <v-list-item-icon class="my-3 mr-4">
          <v-img
            :src="currentChannelMember.userIcon"
            width="36"
            height="36"
            class="rounded"
          >
          </v-img>
        </v-list-item-icon>

          <v-list-item-content class="">
            <v-list-item-title class="body-2 font-weight-bold">
              {{ currentChannelMember.displayName }}
            </v-list-item-title>
          </v-list-item-content>
          
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    modalVisible: false,
  }),

  computed: {
    ...mapGetters([
      'currentChannelName',
      'currentChannelMembers',
      ]),

    displayMembers() {
      if(!this.currentChannelMembers) return
      if(this.currentChannelMembers.length > 3) {
        return this.currentChannelMembers.slice(0, 2)
      } else {
        return this.currentChannelMembers
      }
    },

    membersLength() {
      if(!this.currentChannelMembers) return
      return this.currentChannelMembers.length
    }
  }
}
</script>

<style lang="scss" scoped>
.memberContainer {
  cursor: pointer;

  &:hover .memberLength {
    background: rgba(29, 28, 29, 0.04);
  }
}

.displayIcon {
  position: relative;
  background: white;
  box-shadow: 0 0 0 2px white;
}

.memberLength {
  padding: 0 8px 0 14px;
  line-height: 24px;
  z-index: -4;
}

@for $i from 1 through 3 {
  .displayIconZ-#{$i} {
    z-index: -#{$i};
  }
}

.memberList {
  max-height: calc(100% - 62px);
  overflow: scroll;
}
</style>