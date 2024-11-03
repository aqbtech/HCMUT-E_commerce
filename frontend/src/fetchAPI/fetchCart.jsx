import axios from "axios";
import { axiosClient2 } from "../fetchAPI/axios";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";
 
const BASE_URL = 'http://localhost:3000/cart';

export const updateCart = async (updatedData, id) => {
    try {
        const response = await axios.patch(`${BASE_URL}/${id}`, updatedData); // Đảm bảo endpoint chính xác
        return response.data.Items;
    } catch (error) {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
        throw error;
    } 
};

export const fetchCart = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`); // Đảm bảo endpoint chính xác
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
        throw error;
    }
};


export const addToCart = async (body) => {
    const response = await axiosClient2.post( `/${Cookies.get('username')}}`,body)
    .then(() => {
        toast.success("Thêm vào giỏ hàng thành công!")
    })
    .catch((err) => {
        console.log("Lỗi khi thêm vào giỏ hàng: ", err);
        throw err;
    })

}
