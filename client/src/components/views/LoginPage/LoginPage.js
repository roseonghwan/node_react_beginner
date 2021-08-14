import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'

function LoginPage(props) {

  const dispatch = useDispatch()

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = event => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = event => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = event => {
    // 페이지 리프래쉬를 막음
    event.preventDefault();
    let body = {
      email: Email,
      password: Password
    }

    // redux 사용
    dispatch(loginUser(body))
      .then(response => {
        // 로그인 성공시 루트 페이지 이동
        if (response.payload.loginSuccess) {
          props.history.push('/')
        } else {
          alert('입력한 정보가 틀립니다.')
        }

      })

    // // 서버에 전송 -> _actions 파일에서 loginUser.js에서 구현
    // axios.post('/api/user/login', body)
    //   .then(response)
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type='email' value={Email} onChange={onEmailHandler} />

        <label>Password</label>
        <input type='password' value={Password} onChange={onPasswordHandler} />

        <br />
        <button>Login</button>

      </form>
    </div>
  )
}

export default withRouter(LoginPage)
