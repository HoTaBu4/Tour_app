import axios from "axios"
import { showAlert } from "./alert"

export const updateData = async (name, email) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    })

    if (response.data.status === 'success') {
      showAlert('success', 'Data updated successfully');
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
}