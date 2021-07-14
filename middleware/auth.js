const { User } = require('../models/User')

let auth = (req, res, next) => {
  // 인증 처리

  // client 쿠키에서 토큰을 가져옴
  let token = req.cookies.x_auth

  // 가져온 토큰을 복호화해서 유저를 찾음
  User.findByToken(token, (err, user) => {
    if (err) {
      throw err
    }
    if (!user) {
      return res.json({ isAuth: false, error: true })
    }

    // index.js에서 token, user을 사용할 수 있게 하기 위해 req에 넣어줌
    req.token = token
    req.user = user
    // 미들웨어에 갖히기 않기 위해 next
    next()
  })
  // 유저가 있으면 인증 ok
  // 유저가 있으면 인증 no
}

module.exports = { auth }