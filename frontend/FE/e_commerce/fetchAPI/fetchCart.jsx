import axios from "axios";

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
