import axios from 'axios';
import { axiosClient } from '../fetchAPI/axios';

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


export const getCategories = async () =>{
  const res = await axiosClient(`/categories`);
  console.log("danh mục là:",res);
  return res.data
}