import { categories } from '../assets/assets';
import { axiosClient, axiosPublic } from '../fetchAPI/axios';


export const getAllProducts = async (api) =>{
  const res = await axiosClient.get(`/result1`);
  
  return res.data;
}

export const getDetailProduct = async (api) =>{
  const res = await axiosClient.get(`/productDetail`);
  console.log(`Lấy thành công sản phẩm:`, res);
  return res.data;
}

export const getReview = async (api) => {
  const res = await axiosClient.get(`/productDetail/${api}`);
  
  return res.data;
}

export const fetchProductsWithFilters = async () => {
  const res = await axiosClient.get(`/keyword`);
  
  return res.data;
}


export const getProductForShopView =  async () => {  
  try {
    const res = await axiosClient.get(`/productShop`)
    console.log(`Lấy thành công sản phẩm:`, res);
    return res.data;
  } catch(err) {
      console.log(`Lỗi khi lấy thông tin shop: `, err );
      throw err;
  }
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

export const getProductForSearch = async (keyword, page, sort, body, isFilter) => {
  try {
    if(isFilter) {
      const res = await axiosPublic.get(`/search?keyword=${keyword}&page=${page}&size=12&sort=${sort}&isFilter=true`, body); 
      console.log(`Tìm kiếm sản phẩm thành công`);
      return res.data.result;
    } else {
      const res = await axiosPublic.get(`/search?keyword=${keyword}&page=${page}&size=10&sort=${sort}`); 
      console.log(`Tìm kiếm sản phẩm thành công`);
      return res.data.result;
    }
  } catch(err) {
    console.log("Lỗi khi tìm kiếm sản phẩm");
    throw err;
  }
}

export const getProductForShop = async (shopId, page, categories, sort ) => {
  try {
    const res = await axiosPublic.get(`/product_shop?shopId=${shopId}&category=${categories}&sort=${sort}&page=${page}`); 
    console.log(`Thành công lấy sản phẩm của shop`);
    return res.data.result;
  } catch(err) {
    console.log("Lỗi khi lấy sản phẩm của shop");
    throw err;
  }
}

export const getProductOfCategory = async (category, page) => {
  try {
    const res = await axiosPublic.get(`/home-page?page=${page}&category=${category}`)
    console.log(`Thành công lấy sản phẩm của danh mục`);
    return res.data.result;
  } catch(err) {
    console.log("Lỗi khi lấy sản phẩm của danh mục");
    throw err;
  }
}
