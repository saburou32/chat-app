const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebaseTools = require('firebase-tools')

if(!admin.apps.length) {
  admin.initializeApp()
}

// チャンネルの削除実行されたらサブコレクションのmessages削除する
exports.deleteDocument = functions
  .region('asia-northeast1')
  .firestore
  .document('channels/{channel}')
  .onDelete(async (snap, context) => {
    const deleteDoc = snap.data()
    if(!deleteDoc) {
      return
    }
    const channelId = context.params.channel

    try {
      await firebaseTools.firestore
        .delete(`channels/${channelId}/messages`, {
          project: process.env.GCLOUD_PROJECT,
          recursive: true,
          yes: true,
          token: functions.config().fb.token
        })
      await firebaseTools.firestore
        .delete(`channels/${channelId}/memberList`, {
          project: process.env.GCLOUD_PROJECT,
          recursive: true,
          yes: true,
          token: functions.config().fb.token
        })
    } catch (err) {
      console.error(err)
    }
  })