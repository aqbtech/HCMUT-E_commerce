import { axiosClient2 } from '../fetchAPI/axios';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';

//----------------------------mới ----------------------------------------------

export const getAddress = async () => {
  try {
    const res = await axiosClient2.get(`address?username=${Cookies.get('username')}`);
    console.log("Lấy thành công địa chỉ giao hàng:", res);
    return res.data.result;
  } catch (err) {
    console.log("Lỗi khi lấy địa chỉ giao hàng:", err);
    throw err;
  }
};

export const createAddress =  async (body) => {
  try {
    const res = await axiosClient2.post(`address/${Cookies.get('username')}`, body)
    console.log("Tạo thành công địa chỉ giao hàng:", res);
    return res;
  } catch(err) {
    console.log("Lỗi khi thêm chỉ giao hàng:", err);
    throw err
  }
}

export const updateAddress = async(id, body) => {
  try {
    const res =  await axiosClient2.patch(`address/${id}`, body);
    console.log("Cập nhật địa chỉ thành công:", res)
    return res;
  } catch(err) {
    console.log("Lỗi khi Cập nhật dịa chỉ giao hàng:", err)
    throw err;
  }
} 

export const deleteAdress = async(id) => {
  try {
    const res = await axiosClient2.delete(`address/${id}`)
    console.log("Xóa địa chỉ thành công:", res)
    return res;
  } catch(err) {
    console.log("Lỗi khi xóa dịa chỉ giao hàng:", err)
    throw err;
  }
}