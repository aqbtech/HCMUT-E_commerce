
import { axiosClient2 } from "./axios";
import { axiosClient } from "./axios";
import { toast } from "react-toastify";




export const getInfoShopView = async (shopId) =>{
    try {
        const res = await axiosClient(`/shopInfo?id=${shopId}`);
        console.log(`Lấy thành công thông tin shop:`, res);
        return res.data;
    } catch(err) {
        console.log(`Lỗi khi lấy thông tin shop: `, err );
        throw err;
    }
}
