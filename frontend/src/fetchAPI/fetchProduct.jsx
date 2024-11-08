import { axiosClient, axiosClient2 } from '../fetchAPI/axios';




export const getAllProducts = async (api) =>{
  const res = await axiosClient.get(`/products${api}`);
  
  return res.data;
}



//-----
export const getProduct = async (api) => {
  await axiosClient2.get(`/product?${api}`)
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
      const res = await axiosClient2.get(`/query_product_detail?productId=${productId}`);
      console.log(`Lấy thành công sản phẩm:`, res);
      return res.data.result;
  } catch (err) {
      console.log("Lỗi lấy chi tiết sản phẩm:", err);
      throw err;
  }
};


export const getReviewById = async (productId, page, prevPage) => {
  await axiosClient2.get(`/product/comment/${productId}?page=${page}&prevPage=${prevPage}&limit=10`)
  .then((res) => {
    console.log(`Lấy thành công product ${productId}:`, res);
    return res.data
  })
  .catch((err) => {
    console.log(`Lỗi khi lấy review của sản phẩm ${productId}: `, err );
    throw err;
  })
}