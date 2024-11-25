import { axiosClient2 } from '../fetchAPI/axios';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';

export const getBankAccounts = async () => {
    try {
      const res = await axiosClient2.get(`bank?username=${Cookies.get('username')}`);
      console.log("Lấy thành cônng tài khoản ngân hàng", res);
      return res.data.result;
    } catch (err) {
      console.log("Lỗi khi lấy tài khoản ngân hàng:", err);
      throw err;
    }
  };
  
  export const createBankAccount =  async (body) => {
    try {
      const res = await axiosClient2.post(`bank/${Cookies.get('username')}`, body)
      console.log("Thêm thành công tài khoản ngân hàng:", res);
      return res;
    } catch(err) {
      console.log("Lỗi khi thêm tài khoản ngân hàng:", err);
      throw err
    }
  }