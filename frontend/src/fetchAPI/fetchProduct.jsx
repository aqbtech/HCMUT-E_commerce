import { axiosClient, axiosPublic } from '../fetchAPI/axios';


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
export const getProduct = async (api) => {
  await axiosPublic.get(`/product?${api}`)
  .then((res)=> {
    console.log(`Lấy thành công list sản phẩm:`, res);
    return res.data
  })
  .catch(( err) => {
    console.log(`Lỗi khi lấy list sản phẩm: `, err );
    throw err;
  }) 
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