import { axiosClient2, axiosClient } from '../fetchAPI/axios';
import Cookies from 'js-cookie'



export const getAllOrders = async (page) => {
  const response = await axiosClient.get(`/allOrders?_page=${page}&_limit=3`)
  return response.data;
}

export const updateOrder = async (orderId) => {
  const response = await axiosClient.get(`/allOrders/${orderId}`)
}



//----
  export const createOrder = async (body) => {
    const response = (await axiosClient2.post(`/buyer/order`,body))
    .then((res) => {
      console.log("Đặt hàng thành công", res);
    })
    .catch((err) => {
      console.log("Đặt hàng thất bại". err);
      throw err;
    })

  };
   
  export const getListOrders = async (username) => {
    const response = axiosClient2.get(`buyer/order/${username}`)
    .then(() => {

      return res.data.result;
    })
    .catch((err) => {
      console.log("Lỗi khi lấy danh sách đơn hàng:", err);
      throw err
    })

  };

  export const updateSateOfOrder = async (id, body) => {
    const response = axiosClient2.put(`/buyer/order/updatestate/${id}`, body);

  }  