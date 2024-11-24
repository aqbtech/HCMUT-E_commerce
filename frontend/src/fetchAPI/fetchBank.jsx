import { axiosClient2 } from '../fetchAPI/axios';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';

export const getBankAccounts = async () => {
    try {
      const res = await axiosClient2.get(`bank?username=${Cookies.get('username')}`);
      console.log("Lấy thành công địa chỉ giao hàng:", res);
      return res.data.result;
    } catch (err) {
      console.log("Lỗi khi lấy địa chỉ giao hàng:", err);
      throw err;
    }
  };
  
  export const createBankAccount =  async (body) => {
    try {
      const res = await axiosClient2.post(`bank/${Cookies.get('username')}`, body)
      console.log("Tạo thành công địa chỉ giao hàng:", res);
      return res;
    } catch(err) {
      console.log("Lỗi khi thêm chỉ giao hàng:", err);
      throw err
    }
  }