// src/api/apiAccount.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/donMua';

// Hàm lấy thông tin account từ server
export const fetchOrder = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin account:', error);
    throw error;
  }
};

export const updateState = async (userId, itemId, newState) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${userId}/Items/${itemId}`, {
        state: newState,
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      throw error;
    }
  };