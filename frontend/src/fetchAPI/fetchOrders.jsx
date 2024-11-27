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
    
  export const getListOrders = async (username, page, limmit) => {
    const response = await axiosClient2.get(`/buyer/order/${username}?page=${page}&limit=${limmit}`)
    console.log("Lay hang thanh cong:", response);
    return response.data.result;
  };

export const getListWaitingOrders = async (username, page, limmit) => {
  const response = await axiosClient2.get(`/seller/waiting_order/${username}?page=${page}&limit=${limmit}`)
  console.log("Lay don hang thanh cong:", response);
  return response.data.result;
};


export const getListApprovedOrders = async (username, page, limmit) => {
  const response = await axiosClient2.get(`/seller/approved_order/${username}?page=${page}&limit=${limmit}`)
  console.log("Lay don hang thanh cong:", response);
  return response.data.result;
};

export const getListCancelledOrders = async (username, page, limmit) => {
  const response = await axiosClient2.get(`/seller/cancelled_order/${username}?page=${page}&limit=${limmit}`)
  console.log("Lay don hang thanh cong:", response);
  return response.data.result;
};


  export const cancelOrder = async (body) => {
    const response = axiosClient2.put(`/buyer/delete_order`, body);
  }


export const approveOrderForSeller = async (body) => {
  const response = axiosClient2.put(`/seller/approve_order`, body);
}


export const cancelOrderForSeller = async (body) => {
  const response = axiosClient2.put(`/seller/delete_order`, body);
}