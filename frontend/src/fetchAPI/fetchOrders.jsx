// src/api/apiAccount.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { axiosClient2 } from '../fetchAPI/axios';
import Cookies from 'js-cookie'


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




  //---------------------server BE ---------------------------------
  export const createOrder = async (body) => {
    const response = axiosClient2.post(`buyer/order/create/${Cookies.get('username')}`,body);

  };
   

  export const getListOrders = async (username) => {
    const response = axiosClient2.get(`buyer/order/${username}`)
    .then(() => {

      return response;
    })
    .catch((err) => {
      console.log("Lỗi khi lấy danh sách đơn hàng:", err);
      throw err
    })

  };

  export const updateSateOfOrder = async (id, body) => {
    const response = axiosClient2.put(`/buyer/order/updatestate/${id}`, body);

  }