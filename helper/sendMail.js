const nodemailer = require('nodemailer')

const sendMail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('❌ Error sending email:', error)
    } else {
      console.log('✅ Email sent: ' + info.response)
    }
  })
}

module.exports = {
  sendMail,
}
