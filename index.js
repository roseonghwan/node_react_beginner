const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const { User } = require('./models/User')
const config = require('./config/key')

// // application/x-www-form-urlencode 데이터를 분석해서 가져옴
// bodyParser는 옛버전, express로 넣어도 대체 가능
app.use(express.urlencoded({ extended: false }))
// // application/json 타입의 데이터로 가져옴
app.use(express.json())

// 비밀번호가 있으므로 gitignore 파일에 넣어줌
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// function(req, res){ ~~~~ } 과 같은 뜻
app.get('/', (req, res) => {
  res.send('Hello World~~! 안녕하세요!!')
})

app.post('/register', (req, res) => {
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
    // 성공
    else {
      return res.status(200).json({ success: true })
    }
  })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})