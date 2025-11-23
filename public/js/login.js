import axios from "axios"
import '@babel/polyfill'
import { showAlert } from "./alert"

export const login = async(email, password) =>  {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    })

    if (res.data.status == 'success') {
      showAlert('success', 'logged in successfully')
      window.setTimeout(() => {
        location.assign('/')
      },1500)
    }
  } catch (error) {
    const message = error?.response?.data?.message || 'Something went wrong. Please try again.';
    showAlert('error', message)
  }

}
