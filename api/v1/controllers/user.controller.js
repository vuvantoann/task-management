const User = require('../models/user.model')
const md5 = require('md5')

const ForgotPassword = require('../models/forgot-password.model')

const generateHelper = require('../../../helper/generate')
const sendMailHelper = require('../../../helper/sendMail')

//[POST]/api/v1/user/register
module.exports.register = async (req, res) => {
  const email = req.body.email

  const emailExist = await User.findOne({ email: email })

  if (emailExist) {
    res.json({
      code: 400,
      message: 'Email đã tồn tại',
    })
  } else {
    req.body.password = md5(req.body.password)
    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      token: generateHelper.generateRandomString(30),
    })

    await newUser.save()
    const token = newUser.token
    res.cookie('token', token)
    res.json({
      code: 200,
      message: 'tạo tài khoản thành công',
      token: token,
    })
  }
}

//[POST]/api/v1/user/login
module.exports.login = async (req, res) => {
  const email = req.body.email
  const password = md5(req.body.password)
  const user = await User.findOne({
    email: email,
    deleted: false,
  })
  if (!user) {
    res.json({
      code: 400,
      message: 'Email không tồn tại',
    })
    return
  }

  if (password != user.password) {
    res.json({
      code: 400,
      message: 'Sai mật khẩu',
    })
    return
  }

  if (user.status === 'inactive') {
    res.json({
      code: 400,
      message: 'Tài khoản đã bị khóa',
    })
    return
  }

  const token = user.token
  res.cookie('token', token)

  res.json({
    code: 200,
    message: 'Đăng nhập thành công',
    token: token,
  })
}

//[POST]/api/v1/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email

  const user = await User.findOne({
    email: email,
    deleted: false,
  })

  if (!user) {
    res.json({
      code: 400,
      message: 'Email không tồn tại',
    })
    return
  }

  // nếu có tồn tại email thì gửi mã OTP qua cho email

  //lưu thông tin email vào mã otp đã tạo vào mongodb trước
  const otp = generateHelper.generateRandomNumber(8)
  const timeExpire = 5
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: new Date(Date.now() + timeExpire * 60 * 1000),
  }

  console.log(objectForgotPassword)

  const forgotPassword = new ForgotPassword(objectForgotPassword)
  await forgotPassword.save()

  //Gửi mã OTP cho khách hàng

  const subject = 'Mã OTP xác minh lấy lại mật khẩu'
  const html = `
  Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b>
  (Sử dụng trong ${timeExpire} phút).<br>
  Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
`

  sendMailHelper.sendMail(email, subject, html)

  res.json({
    code: 200,
    message: 'Đã gửi mã otp qua email ',
  })
}

//[POST]/api/v1/password/otp
module.exports.otpPassword = async (req, res) => {
  const otp = String(req.body.otp).trim()
  const email = req.body.email.trim()

  console.log('🔍 Tìm với:', { email, otp })

  const result = await ForgotPassword.findOne({ email, otp })

  console.log('✅ Kết quả:', result)
  if (!result) {
    res.json({
      code: 400,
      message: 'Mã OTP không hợp lệ',
    })
    return
  }
  const user = await User.findOne({
    email: email,
  })

  const token = user.token
  res.cookie('token', token)

  res.json({
    code: 200,
    message: 'Xác thực thành công',
    token: token,
  })
}

//[POST]/api/v1/password/reset
module.exports.resetPassword = async (req, res) => {
  const password = md5(req.body.password)
  const token = req.cookies.token // lấy token từ khi đã xác thực thành công
  //const token = req.body.token // lấy token từ ông frond end gửi lên

  console.log('🔍 Tìm với:', { password, token })

  await User.updateOne(
    {
      token: token,
    },
    {
      password: password,
    }
  )

  res.json({
    code: 200,
    message: 'Đổi mật khẩu thành công',
  })
}

//[get]/api/v1/user/detail
module.exports.detail = async (req, res) => {
  res.json({
    code: 200,
    message: 'thành công',
    infoUser: req.user,
  })
}

//[get]/api/v1/user/detail
module.exports.list = async (req, res) => {
  const users = await User.find({
    deleted: false,
  }).select('fullName email')
  res.json({
    code: 200,
    message: 'thành công',
    users: users,
  })
}
