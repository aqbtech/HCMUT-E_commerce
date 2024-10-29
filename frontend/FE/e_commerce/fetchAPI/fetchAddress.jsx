import axios from 'axios';

const BASE_URL = 'http://localhost:3000/address';

// Lấy danh sách địa chỉ
export const fetchAddresses = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách địa chỉ:', error);
    throw error;
  }
};

// Thêm địa chỉ mới
export const addAddress = async (name, phone, city, province, detailAddress, type) => {
  try {
    const response = await axios.post(BASE_URL, {
      name, 
      phone, 
      city, 
      province,
      detailAddress,
      type
    });
    console.log('Tạo địa chỉ thành công:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm địa chỉ:', error);
    throw error;
  }
};

// Xóa địa chỉ theo ID
export const deleteAddress = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    console.log(`Xóa địa chỉ thành công: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa địa chỉ ${id}:`, error);
    throw error;
  }
};

// Cập nhật địa chỉ theo ID
export const updateAddress = async (id, updatedData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, updatedData);
    console.log(`Cập nhật địa chỉ thành công: ${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật địa chỉ ${id}:`, error);
    throw error;
  }
};
