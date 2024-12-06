import { axiosClient2, axiosPublic } from '../fetchAPI/axios';
import Cookies from 'js-cookie'

//--------------------------Mới---------------------------
export const register = async (body) => {
  const response = await  axiosPublic.post('/register', body);
  return response.data.result;
}

export const SignIn = async (body)  => {
  return await axiosPublic.post('/auth/token', body);
}

export const resetPassword = async (body) => {
  return await axiosClient2.post(`/auth/reset_passwd`, body);

}
 
export const changePass = async (body) => {
  return await axiosClient2.post(`/user/change`, body);
}

export const logOut = async() => {
  const token = Cookies.get('token')
  const body = {
    "token" : token
  }
  return await axiosClient2.post(`/auth/logout`, body);
}

export const getMininalProfile = async() => {
  const response = await axiosClient2.get(`/minimal-profile`);
  return response.data.result;
} 

export const getProfile = async () => {
  const response = await axiosClient2.get(`/buyer/get_information`);
  return response.data.result;
} 

export const updateProfile = async (body) => {
  const response = await axiosClient2.put(`/buyer/update_information`, body)
  return response.data.result;
}

export const isRegistSeller = async () => {
  const response = await axiosClient2.get();
  return response.data.result;
}

export const registSeller = async (body) => {
  const response =  await axiosClient2.post(`/sellerregister`, body);
  return response.data.result;
}

export const checkStatus = async () => {
  const id = Cookies.get("username");
  const response = await axiosClient2.get(`/seller/status_seller?id=${id}`);
  return response.data.result;
} 