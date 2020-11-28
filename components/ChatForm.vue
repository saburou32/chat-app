<template>
  <v-container class="column pb-0">
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
            :candidateUsers="candidateUsers"
            class="message__mention rounded"
            @catchMentionUser="setMentionUser"
          />
          <v-form ref="chat_form">
            <v-textarea
              rows="2"
              auto-grow
              hide-details="false"
              :placeholder="`#${ currentChannelName } へのメッセージ`"
              v-model="text"
              :disabled="isProcessing"
              @click="openModal = false"
              @keydown.exact.ctrl.enter="addMessage"
              @keydown.@="openMentionList"
              @keydown.delete.up.down.right.left="openModal = false"
              @compositionend="searchMentionUsers"
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
    <v-snackbar
      v-model="snackBar.show"
      :color="snackBar.color"
      :timeout='2000'
    >
      {{ snackBar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { db, functions } from '~/plugins/firebase'
import MentionModal from '~/components/MentionModal.vue'
import { mapGetters } from 'vuex'

export default {
  // props: {
  //   channelMembers: Array,
  // },

  components: {
    MentionModal,
  },

  data: () => ({
    text: '',
    isProcessing: false,
    isActiveTextarea: false,
    openModal: false,
    mentionUsers: [],
    candidateUsers: [],
    snackBar: {
      color: '',
      message: '',
      show: false,
    },
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
        this.sendMail()
        const channelRef = await db.collection('channels').doc(this.currentChannel)
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
        this.text = ''
        this.isProcessing = false
      }
    },

    mentionToUserReg() {
      const mentionReg = /(?<=^@|＠|[^\w]@|[^\w]＠)(\S*)/gi
      const mentionResult = this.text.match(mentionReg)
      if(!mentionResult) return
      this.mentionUsers.splice(0)
      this.currentChannelMembers.forEach(member => {
        if(!mentionResult.includes(member.displayName)) return
        this.mentionUsers.push({
          name: member.displayName,
          email: member.email,
        })
      })
    },

    sendMail() {
      if(!this.mentionUsers.length) return
      const mailer = functions.httpsCallable('sendMail')
      const mentionUsersName = []
      this.mentionUsers.forEach(mentionUser => {
        mailer({
          name: this.currentUser.displayName,
          link: this.$route.params.id,
          email: mentionUser.email,
        })
          .then(mentionUsersName.push(mentionUser.name))
          .catch(err => {
            console.log('response error', err)
          })
      })
      if(!mentionUsersName.length == this.mentionUsers.length) {
        return this.showSnackBar(
          'red',
          'メンションの送信に失敗しました。'
        )
      }
      const mentionDestination = mentionUsersName.join('、')
      this.showSnackBar(
        'blue',
        `${mentionDestination}にメンションを送りました。`
      )
    },

    showSnackBar(color, message) {
      this.snackBar.color = color
      this.snackBar.message = message
      this.snackBar.show = true
    },

    searchMentionUsers() {
      // 文字列先頭からカーソル位置までを変数に
      if(!this.text) return
      const textarea = this.$refs.textarea.$refs.input
      const pos = textarea.selectionStart
      const beforeStr = this.text.substr(0, pos)
      if(!beforeStr.length) return

      // カーソル位置に一番近いメンション文字列を取り出す
      const mentionReg = /(?<=^|[^\w])(@|＠)(\S*)/gi
      const mentionArray = beforeStr.match(mentionReg)
      if(!mentionArray) return
      const searchStr = mentionArray.pop()
      this.candidateUsers.splice(0)
      if(searchStr === '@' || searchStr === '＠') {
        this.openModal = true
        return this.candidateUsers.push(...this.currentChannelMembers)
      }

      //取り出した文字列と合致するユーザーをcandidateUsersに入れる
      const searchStrRemoveAt = searchStr.slice(1)
      const regexp = new RegExp(searchStrRemoveAt + '(.*?)', 'g')
      this.candidateUsers.push(
        ...this.currentChannelMembers.filter( member => {
          return member.displayName.match(regexp)
        })
      )
      if(!this.candidateUsers.length || searchStrRemoveAt == this.candidateUsers[0].displayName) {
        return this.openModal = false
      }
      this.openModal = true
    },

    openMentionList() {
      const [textarea, pos] = this.getCaretPosition()
      const notEngReg = /[^\w]/
      const beforeAtmark = this.text.substr(pos - 1, pos)
      if(!beforeAtmark) return this.openModal = true
      this.openModal = notEngReg.test(beforeAtmark)
    },

    textareaInsertStr(str) {
      const [textarea, pos] = this.getCaretPosition()
      const [len, before, after] = this.getCaretStr(pos)
      const insertWord = str
      this.text = before + insertWord + after
    },

    textInsertAt() {
      const [textarea, pos] = this.getCaretPosition()
      const strReg = /./
      if(strReg.test(this.text.substr(pos -1, pos))) {
        this.textareaInsertStr(' @')
      } else {
        this.textareaInsertStr('@')
      }
      this.candidateUsers.push(...this.currentChannelMembers)
      this.$refs.textarea.focus()
      this.openModal = true
    },

    setMentionUser(name) {
      const [textarea, pos] = this.getCaretPosition()
      const [len, before, after] = this.getCaretStr(pos)

      const mentionReg = /(?<=^|[^\w])(@|＠)(\S*)/gi
      const beforeMentionArray = before.match(mentionReg)
      if(!beforeMentionArray) return
      const searchStr = beforeMentionArray.pop()
      if(searchStr == '@' || searchStr == '＠') {
        this.textareaInsertStr(name + ' ')
        textarea.focus()
        this.openModal = false
        return
      }
      const searchStrRemoveAt = searchStr.slice(1)
      const mentionStrRemove = before.slice(0, -searchStrRemoveAt.length)
      this.text = mentionStrRemove + name + ' ' + after
      this.openModal = false
      textarea.focus()
    },

    getCaretPosition() {
      const textarea = this.$refs.textarea.$refs.input
      const pos = textarea.selectionStart
      return [textarea, pos]
    },

    getCaretStr(pos) {
      const len = this.text.length
      const before = this.text.substr(0, pos)
      const after = this.text.substr(pos, len)
      return [len, before, after]
    }
  },

  computed: {
    ...mapGetters([
      'isAuthenticated',
      'currentUser',
      'currentChannel',
      'currentChannelName',
      'currentChannelMembers',
    ])
  },

  watch: {
    text: function() {
      this.$nextTick(function() {
        this.searchMentionUsers()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  &__form {
    border: 1px solid #606060;
    position: relative;
  }

  &__mentionModal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
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
    border-radius: 0 0 4px 4px;
  }
}
</style>