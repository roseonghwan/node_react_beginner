const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
// salt 자리수
const saltRounds = 10
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // 빈칸을 없앰
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: { // 유효성 관리
    type: String
  },
  tokenExp: { // 토큰 유효기간
    type: Number
  }
})

// pre()의 내용을 다 하고, next를 실행 즉, 여기선 user.save((err, userInfo)=>{})
userSchema.pre('save', function (next) {
  var user = this // userSchema 전체
  // password가 변환될때만 비밀번호만 암호화
  if (user.isModified('password')) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        return next(err)
      }
      else {
        bcrypt.hash(user.password, salt, function (err, hash) {
          // hash: 암호화된 비밀번호
          if (err) {
            return next(err)
          }
          else {
            user.password = hash
            next()
          }
        })
      }
    })
  }
})
// 스키마를 모델로 감싸줌-> .modle('이름', 스키마)
const User = mongoose.model('User', userSchema);
// 이 모델을 다른 파일에서도 사용할 수 있도록 함
module.exports = { User }