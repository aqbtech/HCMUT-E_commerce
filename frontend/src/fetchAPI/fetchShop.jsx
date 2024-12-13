import { axiosClient2,  } from "./axios";


export const getInfo = async (shopId) => {
    try {
        const res = await axiosClient2.get(`/shop_information?shop=${shopId}`);
        console.log(`Lay shop thành công!`, res);
        return res.data.result;
    } catch(err) {
        console.log(`Lay shop thất bại!`, err);
        throw err;
    }
}
 
export const follow = async (shopId) => {
    try {
        const res = await axiosClient2.post(`/buyer/follow?sellerUsername=${shopId}`);
        console.log(`Theo dõi shop thành công!`, res);
        return res.data.result;
    } catch(err) {
        console.log(`Theo dõi shop thất bại!`, err);
        throw err;
    }
}

export const unfollow = async (shopId) => {
    try {
        const res = await axiosClient2.delete(`/buyer/unfollow?sellerUsername=${shopId}`);
        console.log(`Hủy theo dõi shop thành công!`, res);
        return res.data.result;
    } catch(err) {
        console.log(`Hủy theo dõi shop thất bại!`, err);
        throw err;
    }
}

export const getInforShop = async (shopId) => {
    try {
        const res = await axiosClient2.get(`/seller/shop_information?username=${shopId}`);
        console.log(`Lay shop thành công!`, res);
        return res.data.result;
    } catch(err) {
        console.log(`Lay shop thất bại!`, err);
        throw err;
    }
}


export const updateInfo = async (shopId, body) => {
    try {
        const res = await axiosClient2.put(`/seller/update_information?username=${shopId}`, body);
        console.log(`Sửa thông tin shop thành công!`, res);
        return res.data.result;
    } catch(err) {
        console.log(`Sửa thông tin shop thất bại!`, err);
        throw err;
    }
}