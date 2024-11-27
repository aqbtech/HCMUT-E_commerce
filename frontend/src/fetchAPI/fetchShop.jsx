
import { axiosClient2, axiosPublic } from "./axios";
import { axiosClient } from "./axios";

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

//-----------


export const getInfo = async (body) => {
    try {
        const res = await axiosPublic(`/shopInfo`, body);
        console.log(`Theo dõi shop thành công!`, res);
        return res.result.data;
    } catch(err) {
        console.log(`Theo dõi shop thất bại!`, err);
        throw err;
    }
}
 
export const follow = async (shopId) => {
    try {
        const res = await axiosClient2(`/follow?id=${shopId}`);
        console.log(`Theo dõi shop thành công!`, res);
        return res.result.data;
    } catch(err) {
        console.log(`Theo dõi shop thất bại!`, err);
        throw err;
    }
}

export const unfollow = async (shopId) => {
    try {
        const res = await axiosClient2(`/follow?id=${shopId}`);
        console.log(`Hủy theo dõi shop thành công!`, res);
        return res.result.data;
    } catch(err) {
        console.log(`Hủy theo dõi shop thất bại!`, err);
        throw err;
    }
}