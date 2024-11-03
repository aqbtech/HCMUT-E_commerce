import { axiosClient2 } from "../fetchAPI/axios";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";

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

export const getCart =  async () => {
    return await axiosClient2.get(`/buyer/cart/${Cookies.get('username')}`);
}