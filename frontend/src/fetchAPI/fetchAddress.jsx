import axios from 'axios';
import { axiosClient2 } from '../fetchAPI/axios';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3000/address';

// Lấy danh sách địa chỉ
export const fetchAddresses = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách địa chỉ:', error);
    throw error;
  }
};

// Thêm địa chỉ mới
export const addAddress = async (name, phone, city, province, detailAddress, type) => {
  try {
    const response = await axios.post(BASE_URL, {
      name, 
      phone, 
      city, 
      province,
      detailAddress,
      type
    });
    console.log('Tạo địa chỉ thành công:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm địa chỉ:', error);
    throw error;
  }
};

// Xóa địa chỉ theo ID
export const deleteAddress = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    console.log(`Xóa địa chỉ thành công: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa địa chỉ ${id}:`, error);
    throw error;
  }
};

// Cập nhật địa chỉ theo ID
export const updateAddress = async (id, updatedData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, updatedData);
    console.log(`Cập nhật địa chỉ thành công: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật địa chỉ ${id}:`, error);
    throw error;
  }
};



//-----------------------------mới ----------------------------------------------

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
    console.log("Lấy thành công địa chỉ giao hàng:", res);
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