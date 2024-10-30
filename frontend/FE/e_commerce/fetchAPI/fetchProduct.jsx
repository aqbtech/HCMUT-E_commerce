// src/api/apiAccount.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/products';

// Hàm lấy thông tin account từ server
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy thông tin account:', error);
    throw error;
  }
};