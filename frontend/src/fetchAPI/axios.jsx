import axios from "axios";
import Cookies from 'js-cookie'

export const axiosClient = axios.create({

    baseURL: `http://localhost:3000`,
    timeout: 10000,
    headers : {
        'Content-Type' : 'application/json'
    }

});



export const axiosClient2 = axios.create({

    baseURL: `http://localhost:8080`,
    timeout: 10000,
    headers : {
        'Content-Type' : 'application/json'
    }

});


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
        return res;
    }, 
    async (err) => {
        const originalRequest = err.config;
        if (err.response && err.response.status === 401) {
            const refreshToken = Cookies.get('token');
            const body = { "refreshToken": refreshToken };
            console.log(refreshToken, body, err);

            try {
                // Gọi đến endpoint /refresh của backend
                const res = await axiosClient2.post('/auth/refresh', body);
                // Kiểm tra `res.data.result.token` thay vì `res.result.token`
                const newAccessToken = res.data.result.token;

                if (newAccessToken) {
                    // Lưu token mới vào cookie và cập nhật header
                    Cookies.set('token', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                  
                } else {
                    throw new Error("Không lấy được token mới.");
                }
            } catch (error) {
                // Xử lý khi refresh token không hợp lệ hoặc hết hạn
                Cookies.remove('token');
                return Promise.reject(error);
            }
        }
        return Promise.reject(err);
    }
);
