// src/api/apiAccount.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/user';

// Hàm lấy thông tin account từ server
export const fetchAccount = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`);
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

