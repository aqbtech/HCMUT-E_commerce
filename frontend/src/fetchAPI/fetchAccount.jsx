import { axiosClient2, axiosPublic } from '../fetchAPI/axios';
import Cookies from 'js-cookie'

//--------------------------Mới---------------------------
export const register = async (body) => {
  return await axiosPublic.post('/user', body);

}

export const SignIn = async (body)  => {
  return await axiosPublic.post('/auth/token', body);
   
}

export const resetPassword = async (body) => {
  return await axiosClient2.post(`/auth/reset_passwd`, body);

}
 

export const getInfo = async (username) => {
  return await axiosClient2.get(`/user/info/${username}`);
 
}

export const updateAccount = async (body) => {
  return await axiosClient2.patch(`/user/info/${Cookies.get('username')}`, body);

}

