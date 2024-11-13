import { axiosClient2, axiosClient} from "../fetchAPI/axios";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";


export const getMyCart = async (page) => {
    const response = await axiosClient.get(`/cart?_page=${page}&_limit=3`);

    return response.data;
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

export const fetchCart =  async () => {
    const res =  await axiosClient2.get(`/buyer/cart/${Cookies.get('username')}`);

    return res.data.result
}

export const updateQuantity = async () => {
    return await axiosClient2.put(`/`);
}

export const deleteFromCart = async (body) => {
    return await axiosClient2.delete(`/${body}`)
}