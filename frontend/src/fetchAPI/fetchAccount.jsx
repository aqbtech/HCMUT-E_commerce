// src/api/apiAccount.js
import axios from 'axios';
import { axiosClient, axiosClient2 } from '../fetchAPI/axios';

const BASE_URL = 'http://localhost:8080/auth/token';

// Hàm lấy thông tin account từ server
export const fetchAccount = async (account) => {
  try {
    const response = await axios.post(`${BASE_URL}`, account,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    // const response = await axios.get(`${BASE_URL}/${userId}`);
    console.log('Lấy thông tin account thành công:', response);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin account:', error);
    throw error;
  }
};

// Hàm cập nhật account trên server
export const updateAccount = async (userId, updatedData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${userId}`, updatedData);
    return response;
  } catch (error) {
    console.error('Lỗi khi cập nhật account:', error);
    throw error;
  }
};

export const createAccount = async (id, pass, email, hovatendem, ten, sdt, date) => {
  try {
    const response = await axios.post(`http://localhost:3000/user`, {
      id,
      pass,
      email,
      Hovatendem: hovatendem,
      ten,
      sdt,
      date,
      role: "b", // Hoặc giá trị role bạn muốn gán
      status: 1
    });
    console.log('Tạo tài khoản thành công:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error);
    return null;
  }
}
 



export const register = async (body) => {
   const res = await axiosClient.post('/user', body);
   console.log(res)
    return res;
}


export const SignIn = async (body)  => {
  const res = await axiosClient2.post('/auth/token', body);


  return res;
}


export const getInfo = async (username) => {
  return await axiosClient2.get(`/user/info/${username}`);
}





