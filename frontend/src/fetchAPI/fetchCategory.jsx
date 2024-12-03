import { axiosClient, axiosClient2, axiosPublic } from '../fetchAPI/axios';

 
export const getCateShop = async (shopId) =>{
  const res = await axiosClient(`/categories?shopId=${shopId}`);
  console.log("danh mục là shop là:",res);
  return res.data
}

//------------
export const getAllCategories = async () => {
  try {
    const res =  await axiosPublic.get(`/category`)
    console.log(`Lấy thành công danh mục `, res);
    return res.data.result;
  } catch(err) {
    console.log(`Lỗi khi lấy danh mục:`, err);
    throw err;
  }
}


export const getCategoriesForShop = async (shopId) => {
  await axiosClient2.get(`/categories?shopId=${shopId}`)
  .then((res)=> {
    console.log(`Lấy thành công danh mục của shop`, res);
    return res.data
  })
  .catch((err)=>{
    console.log(`Lỗi khi lấy danh mục:`, err);
    throw err;
  })
}

export const getAllCategory = async () => {
  const response = await axiosClient2.get(`/category`)
  console.log(response);
  return response.data.result;
};


