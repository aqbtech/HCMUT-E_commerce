import { axiosClient2, axiosClient} from "../fetchAPI/axios";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";


export const getMyCart = async (page, limit) => {
    const response = await axiosClient.get(`/Cart?_page=${page}&_limit=${limit}`);

    return response.data[0];
}
 
 
//--------
export const addToCart = async (body) => {
    const res = await axiosClient2.post( `/${Cookies.get('username')}}`,body)
    .then((res) => {
        toast.success("Thêm vào giỏ hàng thành công!")
    })
    .catch((err) => {
        console.log("Lỗi khi thêm vào giỏ hàng: ", err);
        throw err;
    })
}

export const fetchCart =  async (page, limit) => {
    const res =  await axiosClient2.get(`/flash-cart?username=adarby50179`);
    console.log("lay gio hnag thanh cong", res);
    return res.data.result
}

export const updateQuantity = async () => {
    return await axiosClient2.put(`/`);
}

export const deleteFromCart = async (body) => {
    return await axiosClient2.delete(`/${body}`)
}