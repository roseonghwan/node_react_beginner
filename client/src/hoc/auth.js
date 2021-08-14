import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';


export default function (SpecificComponent, option, adminRoute = null) {
  // null -> 아무나 출입이 가능한 페이지
  // true -> 로그인한 유저만 출입이 가능한 페이지
  // false -> 로그인한 유저는 출입이 불가능한 페이지
  // admin만 출입이 가능한 페이지를 만들땐 마지막 인자를 true로 설정

  // backend에 request를 보내 현재 사용자의 상태를 가져옴
  function AuthenticationCheck(props) {

    const dispatch = useDispatch();

    useEffect(() => {
      // redux 사용
      dispatch(auth())
        .then(response => {
          console.log(response);
          // 로그인하지 않은 상태
          if (!response.payload.isAuth) {
            if (option) {
              props.history.push('/login')
            }
          }
          // 로그인된 상태
          else {
            if (adminRoute && !response.payload.isAuth) {
              props.history.push('/')
            }
            else {
              if (option === false) {
                props.history.push('/')
              }
            }
          }
        })
    }, [])
    return (<SpecificComponent />)
  }



  return AuthenticationCheck
}