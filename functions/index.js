const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebaseTools = require('firebase-tools')

const nodemailer = require('nodemailer')
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
    const email = {
      from: gmailEmail,
      to: data.email,
      subject: 'チャットルームからのお知らせ',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
      "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>チャットルームからのお知らせ</title>
          <style type="text/css">
            .siteName {
              font-size: 24px;
              text-align: center;
            }
            .main {
              width: 40%;
              padding: 0 30px 30px;
              margin: 0 auto;
              border: 1px solid #888;
              border-radius: 10px;
              text-align: center;
            }
            .message {
              margin-bottom: 20px;
              color: #444;
              font-size: 18px;
            }
            .link {
              display: block;
              width: 30%;
              padding: 10px 20px;
              margin: 0 auto;
              background: #601F69;
              color: white;
              font-weight: bold;
              text-decoration: none;
              border-radius: 5px;
            }
            a:visited,
            a:active,
            a:hover {
              color: white;
            }
          </style>
        </head>
        <body>
          <h1 class="siteName">チャットルーム</h1>
          <div class="main">
            <h2 class="message">${data.name}さんからメッセージが届いています。</h2>
            <a class="link" href="https://chat-app-f1f7c.web.app/channels/${data.link}">メッセージを確認</a>
          </div>
        </body>
        </html>`,
    }
    mailTransport.sendMail(email, (err, info) => {
      if (err) {
        return console.log(err)
      }
      return console.log('success')
  })
})