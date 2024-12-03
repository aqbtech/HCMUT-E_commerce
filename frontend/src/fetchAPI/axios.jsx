import axios from "axios";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";
   
export const axiosClient = axios.create({
    baseURL: `http://localhost:3000`,
    timeout: 10000,
    headers : {
        'Content-Type' : 'application/json'
    }
});

export const axiosClient2 = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosClient2.interceptors.request.use(
    async (config) => {
        const token = Cookies.get('token');

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config
    }, (err) =>  {
        return Promise.reject(err)
})

axiosClient2.interceptors.response.use(
    (res) => {
        return res; // Trả về response nếu không có lỗi
    },
    async (err) => {
        const originalRequest = err.config;
        const currentToken = Cookies.get('token');

        // Kiểm tra nếu lỗi là 401 và có token (dấu hiệu có thể do token hết hạn)
        if (err.response.status === 401 && currentToken) {
            try {
                const refreshToken = currentToken; // Sử dụng token hiện tại như refresh token
                const body = { "refreshToken": refreshToken };
                Cookies.remove('token'); // Xóa token cũ

                // Gọi đến endpoint /refresh để lấy token mới
                const res = await axiosPublic.post('/auth/refresh', body);  
                const newAccessToken = res.data.result.token;

                if (newAccessToken) {
                    // Lưu token mới vào cookie và cập nhật lại header cho request gốc
                    Cookies.set('token', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Gọi lại request gốc với token mới
                    return axiosClient2(originalRequest);
                } else {
                    // Nếu không lấy được token mới, yêu cầu đăng nhập lại
                    Cookies.remove('username');
                    toast.error("Đã có lỗi xảy ra, bạn cần đăng nhập lại!");
                    throw new Error("Không lấy được token mới.");
                }
            } catch (error) {
                // Xử lý khi refresh token không hợp lệ hoặc hết hạn
                toast.error("Đã có lỗi xảy ra, bạn cần đăng nhập lại!");
                return Promise.reject(error);
            }
        }

        // Nếu không phải lỗi 401 do hết hạn token hoặc không có token, trả về lỗi gốc
        return Promise.reject(err);
    }
);

axiosClient2.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if(status === 403) {
                window.location.href = '/Error_403';
            } else if(status === 404) {
                window.location.href = '/Error_404';
            } else if(status === 500) {
                alert('Lỗi hệ thống. Vui lòng thử lại sau.');
            } 
        } else if (error.message === 'Network Error') {
            alert('Không có kết nối mạng. Vui lòng kiểm tra Internet.');
        } 
        return Promise.reject(error);
    }
);

axiosPublic.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if(status === 404) {
                window.location.href = '/Error_404';
            } else if(status === 500) {
                alert('Lỗi hệ thống. Vui lòng thử lại sau.');
            }
        }  else if (error.message === 'Network Error') {
            alert('Không có kết nối mạng. Vui lòng kiểm tra Internet.');
        } 
        return Promise.reject(error);
    }
);



