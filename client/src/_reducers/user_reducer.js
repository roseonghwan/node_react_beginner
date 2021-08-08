import {
  LOGIN_USER,
  REGISTER_USER
} from '../_actions/types'


export default function (previousState = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      // ...은 그대로 복사해서 가져온다고 생각
      // loginSuccess에는 backend에서 가져온 정보가 저장됨
      return { ...previousState, loginSuccess: action.payload }
      break;

    case REGISTER_USER:
      return { ...previousState, register: action.payload }
      break;

    default:
      return previousState;
  }
}