const User = require('../models/user.model')

module.exports.requireAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]
    const infoUser = await User.findOne({
      token: token,
      deleted: false,
    }).select('-password -token')

    if (!infoUser) {
      res.json({
        code: 400,
        message: 'Tài khoản không hợp lệ',
      })
      return
    }

    req.user = infoUser
    next()
  } else {
    res.json({
      code: 400,
      message: 'bạn cần gửi kèm token',
    })
  }
}
