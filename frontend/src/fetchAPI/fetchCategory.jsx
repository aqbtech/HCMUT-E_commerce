import { axiosClient2, axiosPublic } from '../fetchAPI/axios';


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

export const getAllCategory = async () => {
  const response = await axiosClient2.get(`/category`)
  console.log(response);
  return response.data.result;
};

export const getRootCategories = async () => {
  try {
    const response = await axiosClient2.get(`/api/admin/category/root`)
    console.log("lấy root cate thành công!",response);
    return response.data.result;
  } catch(err) {
    console.log("Lấy root category thất bại", err);
  }
}

export const getCategoriesForAdmin = async (page) => {
  try {
    const response = await axiosClient2.get(`/api/admin/category/all?page=${page}`)
    console.log("lấy all cate thành công!",response);
    return response.data.result;
  } catch(err) {
    console.log("Lấy all root category thất bại", err);
  }
}

export const createCategory =  async (body) => {
  try {
    const response = await axiosClient2.post(`/api/admin/category/add-category`, body)
    console.log("tạo cate thành công!",response);
    return response.data;
  } catch(err) {
    console.log("tạo all root category thất bại", err);
  }
}

export const updateCategory =  async (body, id) => {
  try {
    const response = await axiosClient2.put(`/api/admin/category/update-category?id=${id}`, body)
    console.log("sửa cate thành công!",response);
    return response.data;
  } catch(err) {
    console.log("sửa all root category thất bại", err);
  }
}

export const deleteCategory =  async (id) => {
  try {
    const response = await axiosClient2.delete(`/api/admin/category/delete-category?id=${id}`)
    console.log("xóa cate thành công!",response);
    return response.data;
  } catch(err) {
    console.log("xóa all root category thất bại", err);
  }
}


