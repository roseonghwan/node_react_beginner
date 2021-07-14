const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
// salt 자리수
const saltRounds = 10
const jwt = require('jsonwebtoken')
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
  else {
    next()
  }
})

// 비밀번호 검증 함수
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword: 입력한 비밀번호와 db에 저장된 암호화된 비밀번호를 비교
  // 입력한 비밀번호를 암호화해서 db에 있는 것과 비교
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err)
    }
    // error는 없고, 
    cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function (cb) {
  // jsonwebtoken을 이용해 token 생성
  var user = this
  // _id는 db에 그대로 _id라고 있음
  // payload는 string 형식이어야 함
  // 그러나 mongodb 에서 생성된 id (user._id)는 string이 아니므로, 
  // mongoDB의 toHexString() 메서드를 사용하여 다음과 같이 형변환을 해주어야 한다. 
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  user.token = token

  user.save((err, user) => {
    if (err) {
      return cb(err)
    }
    cb(null, user)
  })
}

userSchema.statics.findByToken = function (token, cb) {
  var user = this

  // 토큰을 decode
  jwt.verify(token, 'secretToken', (err, decoded) => {
    // 유저 아이디를 이용해서 유저를 찾은 후 클라이언트에서 가져온 토큰과 db에 보관된 토큰을 비교
    user.findOne({ _id: decoded, token: token }, (err, user) => {
      if (err) {
        return cb(err)
      }
      cb(null, user)
    })
  })
}

// 스키마를 모델로 감싸줌-> .modle('이름', 스키마)
const User = mongoose.model('User', userSchema);
// 이 모델을 다른 파일에서도 사용할 수 있도록 함
module.exports = { User }