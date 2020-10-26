<template>
  <v-container class="column">
    <v-row>
      <v-col cols="auto" class="pb-0">
        <v-img
          :src="currentUser.photoURL"
          v-if="isAuthenticated"
          width="12vw"
          height="12vw"
          max-width="50px"
          max-height="50px"
          class="rounded-lg"
        >
        </v-img>
      </v-col>
      <v-col v-if="isAuthenticated">
        <div class="message__form rounded">
          <mention-modal
            v-if="openModal"
            :channelMembers="channelMembers"
            class="message__mention rounded"
            @catchMentionUser="setMentionUser"
          />
          <v-form ref="chat_form">
            <v-textarea
              rows="2"
              auto-grow
              hide-details="false"
              :placeholder="`#${ channelName } へのメッセージ`"
              v-model="text"
              :disabled="isProcessing"
              @keydown.exact.ctrl.enter="addMessage"
              @keydown.@="openMentionList"
              @keydown.delete="deleteAt"
              @focus="isActiveTextarea = true"
              @blur="isActiveTextarea = false"
              ref="textarea"
              class="mt-0 pt-2 px-4"
            >
            </v-textarea>
          </v-form>
          <div
            class="d-flex justify-end px-4"
            :class="{ active__textarea: isActiveTextarea }"
          >
            <v-btn
              text
              min-width="0"
              @click="textInsertAt"
              class="px-3"
            >
              <v-icon
                small
                color="grey darken-2"
              >
                mdi-at
              </v-icon>
            </v-btn>
            <v-btn
              text
              min-width="0"
              :disabled="!text"
              @click="addMessage"
              class="px-3"
            >
              <v-icon
                small
                color="grey darken-2"
              >
                mdi-send
              </v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="px-3">
    </v-row>
  </v-container>
</template>

<script>
import { db } from '~/plugins/firebase'
import MentionModal from '~/components/MentionModal.vue'

export default {
  props: {
    channelName: String,
    channelMembers: Array,
  },

  components: {
    MentionModal,
  },

  data: () => ({
    text: '',
    currentChannel: '',
    isProcessing: false,
    isActiveTextarea: false,
    openModal: false,
    mentionUsers: [],
  }),

  methods: {
    // メッセージ保存
    async addMessage() {
      if(!this.isAuthenticated) return
      if(!this.text) {
        window.alert('1文字以上は入力してください')
        return
      }
      
      if(this.text) {
        this.mentionToUserReg()
        const channelRef = await db.collection('channels').doc(this.$store.state.channelId)
        this.isProcessing = true
        channelRef.collection('messages').add({
          text: this.text,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
          userId: this.currentUser.uid,
          mention: this.mentionUsers,
        })
        channelRef.collection('memberList').doc(this.currentUser.uid).set({
          userId: this.currentUser.uid
        })
        this.text = null
        this.isProcessing = false
      }
    },

    mentionToUserReg() {
      const mentionReg = /(?<=^@|＠|\s@|\s＠|[^\w]@|[^\w]＠)(\S*)/gi
      const mentionResult = this.text.match(mentionReg)
      if(!mentionResult) return
      this.channelMembers.forEach(member => {
        if(!mentionResult.includes(member.displayName)) return
        this.mentionUsers.push(member.displayName)
      })
    },

    openMentionList() {
      const textarea = this.$refs.textarea.$refs.input
      const pos = textarea.selectionStart
      const notEngReg = /[^\w]/
      const beforeAtmark = this.text.substr(pos - 1, pos)
      if(!beforeAtmark) return this.openModal = true
      this.openModal = notEngReg.test(beforeAtmark)
    },

    textareaInsertStr(str) {
      const textarea = this.$refs.textarea.$refs.input
      const pos = textarea.selectionStart
      const len = this.text.length
      const before = this.text.substr(0, pos)
      const after = this.text.substr(pos, len)
      const insertWord = str
      this.text = before + insertWord + after
    },

    textInsertAt() {
      const textarea = this.$refs.textarea.$refs.input
      const pos = textarea.selectionStart
      const strReg = /./
      if(strReg.test(this.text.substr(pos -1, pos))) {
        this.textareaInsertStr(' @')
      } else {
        this.textareaInsertStr('@')
      }
      this.openModal = true
    },

    setMentionUser(name) {
      this.textareaInsertStr(name + ' ')
      this.openModal = false
      this.$refs.textarea.focus()
    },
  },

  computed: {
    currentUser() {
      return this.$store.state.user
    },

    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  },
}
</script>

<style lang="scss" scoped>
.message {
  &__form {
    border: 1px solid #606060;
    position: relative;
  }

  &__mention {
    position: absolute;
    bottom: 80px;
    left: -20px;
    border: 1px solid #d9d9d9;
    overflow: scroll;
    z-index: 1;
  }
}

.active {
  &__textarea {
    background: #f8f8f8;
  }
}
</style>