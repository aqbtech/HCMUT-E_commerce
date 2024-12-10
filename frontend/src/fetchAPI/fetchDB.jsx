import { axiosClient2, axiosPublic} from "./axios.jsx";

export const addToCart_DB = async (productInstanceId, quantity) => {
    const res = await axiosClient2.post( `/database/cart/add?productInstanceId=${productInstanceId}&quantity=${quantity}`)
    console.log("them gio hang thanh cong", res);
    return res.data
}

export const fetchCart_DB =  async (page, limit) => {
    const res =  await axiosClient2.get(`/database/getDetailsCart`);
    console.log("lay gio hang thanh cong", res);
    return res.data
}

export const updateQuantity_DB = async (productInstanceId, quantity) => {
    const res = await axiosClient2.post(`/database/cart/update?productInstanceId=${productInstanceId}&quantity=${quantity}`);
    console.log("Cap nhat gio hang thanh cong", res);
    return res.data
}

export const deleteFromCart_DB = async (productInstanceId) => {
    const res = await axiosClient2.delete(`/database/cart/delete?productInstanceId=${productInstanceId}`)
    console.log("Xoa khoi gio hang thanh cong", res);
    return res.data
}

export const shopInfo_DB =  async (shopId) => {
    const res =  await axiosClient2.get(`/database/shopInfo?shopId=${shopId}`);
    console.log("lay thong tin shop thanh cong", res);
    return res.data
}

export const searchProductByCate_DB = async (categoryName) => {
    const res =  await axiosPublic.get(`/database/getProductByCategory?categoryName=${categoryName}`);
    console.log("lay san pham theo danh muc thanh cong", res);
    return res.data
}
