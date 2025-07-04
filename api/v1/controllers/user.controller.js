const User = require('../models/user.model')
const md5 = require('md5')

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

    const newUser = new User(req.body)
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
