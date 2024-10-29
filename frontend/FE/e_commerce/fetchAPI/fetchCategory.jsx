import axios from 'axios';

const BASE_URL = 'http://localhost:3000/categories';

// Lấy danh sách địa chỉ
export const fetchCategory = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách địa chỉ:', error);
    throw error;
  }
};