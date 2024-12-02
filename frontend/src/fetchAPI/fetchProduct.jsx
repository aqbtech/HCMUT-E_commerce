import {axiosClient, axiosClient2, axiosPublic} from '../fetchAPI/axios';
import {data} from "autoprefixer";


export const getAllProducts = async (api) =>{
  const res = await axiosClient.get(`/products${api}`);
  
  return res.data;
}

export const getDetailProduct = async (api) =>{
  const res = await axiosClient.get(`/result?productId=${api}`);
  console.log(`Lấy thành công sản phẩm:`, res);
  return res.data[0];
}

export const getReview = async (api) => {
  const res = await axiosClient.get(`/productDetail/${api}`);
  
  return res.data;
}

//-----
export const getProduct = async (page) => {
  try {
    const res =  await axiosPublic.get(`/home-page?page=${page}`)
     console.log(`Lấy thành công list sản phẩm:`, res);
    return res.data.result;
  } catch(err) {
    console.log(`Lỗi khi lấy list sản phẩm: `, err );
    throw err;
  }
}


export const getProductsById = async (productId) => {
  try {
      const res = await axiosPublic.get(`/query_product_detail?productId=${productId}`);
      console.log(`Lấy thành công sản phẩm:`, res);
      return res.data.result;
  } catch (err) {
      console.log("Lỗi lấy chi tiết sản phẩm:", err);
      throw err;
  }
};


export const getReviewById = async (productId, page) => {
  try {
    const res = await axiosPublic.get(`/${productId}/reviews?page=${page}`);
    console.log(`Lấy thành công product ${productId}:`, res);
    return res.data.result
  } catch (err){
    console.log(`Lỗi khi lấy review của sản phẩm ${productId}: `, err );
    throw err;
  }
}



export const createProduct = async (body) => {
  try {
      const res = await axiosClient2.post(`/seller/add`, body);
      console.log(`Lỗi khi tạo sản phẩm`);
  }catch (err){
    console.log(`Lỗi khi tạo sản phẩm`);
    throw err;
  }
}

export const getProductOfSeller = async () => {
    try {
        const res =  await axiosClient2.get(`/seller/all-product`)
        console.log(`Lấy thành công list sản phẩm:`, res);
        return res.data.result;
    } catch(err) {
        console.log(`Lỗi khi lấy list sản phẩm: `, err );
        throw err;
    }
}


export const enableProduct = async (productId) => {
    const response = axiosClient2.put(`/seller/enabled-product?productId=${productId}`);
}


export const disableProduct = async (productId) => {
    const response = axiosClient2.put(`/seller/disabled-product?productId=${productId}`);
}

export const productDetail = async (productId) => {
    const response = await axiosClient2.get(`/seller/detailed-product?productId=${productId}`);
    return response.data.result;
}
export const updateProduct = async (body) => {
    const response = await axiosClient2.put(`/seller/update`, body);
    return response.data.result;
}
