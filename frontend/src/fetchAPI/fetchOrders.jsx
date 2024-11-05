import { axiosClient2 } from '../fetchAPI/axios';
import Cookies from 'js-cookie'

//----
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