const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebaseTools = require('firebase-tools')

const nodemailer = require('nodemailer')
const mentionNotice = require('./mails.js')
const gmailEmail = functions.config().gmail.email
const gmailPassword = functions.config().gmail.password
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  }
})

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

// メール送信
exports.sendMail = functions
  .https
  .onCall((data, context) => {
    const mail = new mentionNotice.SendMentionNotice(data)
    const mailOptions =  mail.sendDescription
    mailTransport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err)
      }
      return console.log('success')
  })
})