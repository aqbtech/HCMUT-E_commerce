import { axiosClient2, axiosPublic} from '../fetchAPI/axios';
import Cookies from "js-cookie";
import axios from "axios";


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
        console.log(`Tạo sản phẩm thành công`, res);
        return res.data.result;
    } catch (err) {
        console.log(`Lỗi khi tạo sản phẩm`);
    }
}

export const getProductForSearch = async (keyword, page, sort, body, isFilter) => {
    try {
        if (isFilter) {
            console.log(body);
            const res = await axiosPublic.post(`/search/filter?keyword=${keyword}&page=${page}&sort=${sort}`, body);
            console.log(`Tìm kiếm sản phẩm thành công với lọc`, res);
            return res.data.result;
        } else {
            const res = await axiosPublic.get(`/search?keyword=${keyword}&page=${page}&sort=${sort}`);
            console.log(`Tìm kiếm sản phẩm thành công `, res);
            return res.data.result;
        }
    } catch (err) {
        console.log("Lỗi khi tìm kiếm sản phẩm");
        throw err;
    }
}

export const enableProduct = async (productId) => {
    const response = axiosClient2.put(`/seller/enabled-product?productId=${productId}`);
}

export const getProductOfSeller = async (page) => {
    try {
        const res = await axiosClient2.get(`/seller/all-product?page=${page}`)
        console.log(`Lấy thành công list sản phẩm:`, res);
        return res.data.result;
    } catch (err) {
        console.log(`Lỗi khi lấy list sản phẩm: `, err);
        throw err;
    }
}


export const getProductForAdmin = async (page) => {
    try {
        const res = await axiosClient2.get(`/api/admin/product/all-product?page=${page}`)
        console.log(`Lấy thành công list sản phẩm:`, res);
        return res.data.result;
    } catch (err) {
        console.log(`Lỗi khi lấy list sản phẩm: `, err);
        throw err;
    }
}

export const productDetail = async (productId) => {
    const response = await axiosClient2.get(`/seller/detailed-product?productId=${productId}`);
    return response.data.result;
}

export const updateProduct = async (body) => {
    const response = await axiosClient2.put(`/seller/update`, body);
    return response.data.result;
}

export const getProductForShop = async (shopId, page, categories, sort ) => {
  
  try {
    const res = await axiosPublic.get(`/shop_product?shop=${shopId}&category=${categories}&sort=${sort}&page=${page}`); 
    console.log(`Thành công lấy sản phẩm của shop`, res);
    return res.data.result;
  } catch(err) {
    console.log("Lỗi khi lấy sản phẩm của shop");
    throw err;
  }
}

export const disableProduct = async (productId) => {
    const response = axiosClient2.put(`/seller/disabled-product?productId=${productId}`);
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

export const axiosUpload = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 20000,
});

export const uploadIMG = async (file, productId) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = Cookies.get("token");
    try {
        const res = await axiosUpload.post(`/upload?productId=${productId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error('Lỗi upload ảnh:', error.response || error.message);
        throw error;
    }
};

