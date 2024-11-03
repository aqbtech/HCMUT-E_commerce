import { axiosClient } from '../fetchAPI/axios';

 
export const getCategories = async () =>{
  const res = await axiosClient(`/categories`);
  console.log("danh mục là:",res);
  return res.data
}

