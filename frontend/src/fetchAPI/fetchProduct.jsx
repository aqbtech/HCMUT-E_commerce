// src/api/apiAccount.js
import axios from 'axios';
import { axiosClient, axiosClient2 } from '../fetchAPI/axios';


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



//-----------------------Mới-------------------------------

export const getAllProducts = async (api) =>{
  const res = await axiosClient.get(`/products${api}`);
  
  return res.data;
}


export const getProductsById = async (productId) => {
  try {
      const res = await axiosClient2.get(`/seller/product/get?productId=${productId}`);
      return res.data.result;
  } catch (err) {
      console.log("Lỗi lấy chi tiết sản phẩm:", err);
  }
};