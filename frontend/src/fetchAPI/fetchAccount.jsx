import { axiosClient, axiosClient2 } from '../fetchAPI/axios';
import Cookies from 'js-cookie'

  
//---------------------------Mới---------------------------
export const register = async (body) => {
  return await axiosClient.post('/user', body);

}

export const SignIn = async (body)  => {
  return await axiosClient2.post('/auth/token', body);
   
}

export const getInfo = async (username) => {
  return await axiosClient2.get(`/user/info/${username}`);

}

export const updateAccount = async (body) => {
  return await axiosClient2.patch(`/user/info/${Cookies.get('username')}`, body);

}



 