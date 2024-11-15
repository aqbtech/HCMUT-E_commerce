import { axiosClient2, axiosClient } from '../fetchAPI/axios';





export const getAllOrders = async (page) => {
  const response = await axiosClient.get(`/allOrders?_page=${page}&_limit=1`)
  return response.data;
}

export const updateOrder = async (orderId) => {
  const response = await axiosClient.get(`/allOrders/${orderId}`)
}
 
//----
  export const createOrder = async (body) => {
    const response = await axiosClient2.post(`/buyer/order`,body)

  };
    
  export const getListOrders = async (username) => {
    const response = axiosClient2.get(`/buyer/order/${username}`)
    
    return (await response).data.result;
  };

  export const updateSateOfOrder = async (id, body) => {
    const response = axiosClient2.put(`/buyer/order/updatestate/${id}`, body);
  }  