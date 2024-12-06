import {axiosClient, axiosClient2, axiosPublic} from '../fetchAPI/axios';


export const getShopPolicy = async (page) => {
    try {
        const res = await axiosClient2.get(`policy/get_shopPolicy?page=${page}`)
        console.log(`Lấy thành công danh sách chính sách cho shop:`, res);
        return res.data.result;
    } catch (err) {
        console.log(`Lỗi khi lấy danh sách chính sách cho shop: `, err);
        throw err;
    }
}


export const getCategoryPolicy = async (page) => {
    try {
        const res = await axiosClient2.get(`/policy/get_categoryPolicy?page=${page}`)
        console.log(`Lấy thành công danh sách chính sách cho danh mục:`, res);
        return res.data.result;
    } catch (err) {
        console.log(`Lỗi khi lấy danh sách chính sách cho danh mục: `, err);
        throw err;
    }
}


export const createPolicy = async (body) => {
    try {
        const res = await axiosClient2.post(`/policy/add`, body);
        console.log(`Tạo chính sách thành công!`, res);
        return res.data.result;
    } catch (err) {
        console.log(`Lỗi khi tạo chính sách!`);
    }
}


export const updatePolicy = async (body) => {
    const response = await axiosClient2.put(`/policy/update`, body);
    return response.data.result;
}


export const deletePolicy =  async (type, policyId) => {
    try {
        const response = await axiosClient2.delete(`/policy/delete?type=${type}&policyId=${policyId}`)
        console.log("Xóa chính sách thành công!",response);
        return response.data;
    } catch(err) {
        console.log("Xóa chính sách không thành công!", err);
    }
}


export const getApprovedSeller = async () => {
    try {
        const res = await axiosClient2.get(`/api/admin/seller/getApprovedSeller`)
        console.log(`Lấy thành công danh sách người bán:`, res);
        return res.data.result;
    } catch (err) {
        console.log(`Lỗi khi lấy danh sách người bán: `, err);
        throw err;
    }
}