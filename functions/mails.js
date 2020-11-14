const functions = require('firebase-functions')
const gmailEmail = functions.config().gmail.email

class SendMentionNotice {
  constructor(data) {
    this.mailFrom= gmailEmail
    this.mailTo = data.email
    this.mentionFrom = data.name
    this.channelLink = data.link
  }

  get sendDescription() {
   const mailContent = {
    from: this.mailFrom,
    to: this.mailTo,
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
          <h2 class="message">${this.mentionFrom}さんからメッセージが届いています。</h2>
          <a class="link" href="https://chat-app-f1f7c.web.app/channels/${this.channelLink}">メッセージを確認</a>
        </div>
      </body>
      </html>`,
   }
   return  mailContent
 }
}

exports.SendMentionNotice = SendMentionNotice