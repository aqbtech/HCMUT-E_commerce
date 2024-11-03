import { axiosClient, axiosClient2 } from '../fetchAPI/axios';




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