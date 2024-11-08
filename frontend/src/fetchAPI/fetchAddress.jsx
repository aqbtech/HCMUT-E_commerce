import { axiosClient2 } from '../fetchAPI/axios';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';

//----------------------------mới ----------------------------------------------

export const getAddress =  async () => {
  await axiosClient2.get(`address/${Cookies.get('username')}`)
  .then((res)=> {
    console.log("Lấy thành công địa chỉ giao hàng:", res);
    return res;
  })
  .catch((err)=> {
    console.log("Lỗi khi lấy địa chỉ giao hàng:", err);
    throw err
  })
}

export const createAddress =  async (body) => {
  await axiosClient2.post(`address/${Cookies.get('username')}`, body)
  .then((res)=> {
    console.log("Tạo thành công địa chỉ giao hàng:", res);
    return res;
  })
  .catch((err) => {
    console.log("Lỗi khi thêm chỉ giao hàng:", err);
    throw err
  })
}

export const updAddress = async(id, body) => {
  await axiosClient2.patch(`address/${id}`, body)
  .then((res)=>{
    console.log("Cập nhật địa chỉ thành công:", res)
    toast.success("Cập nhật địa chỉ giao hàng thành công")
    return res;
  })
  .catch((err)=>{
    console.log("Lỗi khi Cập nhật dịa chỉ giao hàng:", err)
    throw err;
  }) 
} 

export const delAdress = async(id) => {
  await axiosClient2.delete(`address/${id}`)
  .then((res) => {
    console.log("Xóa địa chỉ thành công:", res)
    toast.success("xóa địa chỉ giao hàng thành công")
    return res;
  })
  .catch((err) => {
    console.log("Lỗi khi xóa dịa chỉ giao hàng:", err)
    throw err;
  })
}