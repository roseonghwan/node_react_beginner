const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const { User } = require('./models/User')
const config = require('./config/key')
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')

// // application/x-www-form-urlencode 데이터를 분석해서 가져옴
// bodyParser는 옛버전, express로 넣어도 대체 가능
app.use(express.urlencoded({ extended: false }))
// // application/json 타입의 데이터로 가져옴
app.use(express.json())

app.use(cookieParser())

// 비밀번호가 있으므로 gitignore 파일에 넣어줌
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// function(req, res){ ~~~~ } 과 같은 뜻
app.get('/', (req, res) => {
  res.send('Hello World~~! 안녕하세요!!')
})

app.get('/api/hello', (req, res) => {
  res.send("안녕하세용~")
})

app.post('/api/users/register', (req, res) => {
  // 회원가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어줌
  // bodyParser가 있어서 req.body -> {id:"dfsdf", pw:"sdfsad"} 이런식
  const user = new User(req.body)
  // mongoDB의 메서드 save(): 위의 정보들이 user모델에 저장됨
  user.save((err, userInfo) => {
    // 에러일 때 json형식으로 전달
    if (err) {
      return res.json({ success: false, err })
    }
    // 성공, 비밀번호 암호화
    else {
      return res.status(200).json({ success: true })
    }
  })

})

// login 기능
app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 db에서 있는지 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청한 이메일이 db에 있다면 맞는 비밀번호가 같은지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
      }
      // 해당 유저에 대한 토큰 생성
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err)
        }
        // 토큰을 쿠키, 로컬스토리지 등에 저장
        res.cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})
// auth Route
// middleware 콜백함수를 실행 전 해주는 것
app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과했다는 얘기는 auth가 true라는 말
  res.status(200).json({
    _id: req.user._id,
    // role:0-> 일반유저 아니면 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

// logout Route
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user.id },
    { token: "" }, (err, user) => {
      if (err) {
        return res.json({ success: false, err })
      }
      return res.status(200).send({ success: true })
    })
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})