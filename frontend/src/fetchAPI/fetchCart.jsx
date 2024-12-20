import { axiosClient2} from "../fetchAPI/axios";

export const addToCart = async (productInstanceId, quantity) => {
    const res = await axiosClient2.post( `/add-to-cart?productInstanceId=${productInstanceId}&quantity=${quantity}`,)
    console.log("them gio hang thanh cong", res);
    return res.data.result
}

export const fetchCart =  async (page, limit) => {
    const res =  await axiosClient2.get(`/flash-cart?page=${page}&size=${limit}`);
    console.log("lay gio hang thanh cong", res);
    return res.data.result
}

export const updateQuantity = async (productInstanceId, quantity) => {
    return await axiosClient2.post(`/update-cart?productInstanceId=${productInstanceId}&quantity=${quantity}`);
}

export const deleteFromCart = async (productInstanceId) => {
    return await axiosClient2.post(`/remove-from-cart?productInstanceId=${productInstanceId}`)
}