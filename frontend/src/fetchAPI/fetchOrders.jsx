import { axiosClient2, axiosClient } from '../fetchAPI/axios';





export const getAllOrders = async (page) => {
  const response = await axiosClient.get(`/resultOrder`)
  console.log("lay don hang thanh cong", response);
  return response.data;
}

export const updateOrder = async (orderId) => {
  const response = await axiosClient.get(`/allOrders/${orderId}`)
}
 

export const getReviewableProdcuts = async () => {
  const response = await axiosClient.get(`/orderReview`)
  console.log("Lấy các sản phẩm cần đánh giá thành công:", response);
  return response.data;
}


//----
  export const createOrder = async (body) => {
    const response = await axiosClient2.post(`/buyer/order`,body)

  };
    
  export const getListOrders = async (username, page, limmit) => {
    const response = await axiosClient2.get(`/buyer/order/${username}?page=${page}&limit=${limmit}`)
    console.log("Lấy đơn hàng thành công:", response);
    return response.data.result;
  };


  export const cancelOrder = async (body) => {
    const response = axiosClient2.put(`/buyer/delete_order`, body);
  } 


  export const submitProductReview = async (body) => {
    try{
      const response = await axiosClient2.post(`/review`, body)
      console.log("Đánh giá sản phẩm thành công!")
    } catch(err) {
      console.log("Lỗi khi đánh giá sản phẩm")
      throw err
    }
  }
