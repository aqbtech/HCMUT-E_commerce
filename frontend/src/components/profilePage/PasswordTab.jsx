// src/components/PasswordTab.js
import { useState } from 'react';
import { toast } from 'react-toastify';
import Title from "../Title.jsx";

const PasswordTab = ({ onChangePass }) => {
    const [curPass, setCurPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const validatePassword = () => {
        // Kiểm tra mật khẩu hiện tại
        if (!curPass || !newPass || !confirmPass) return toast.error("Vui lòng nhập đầy đủ thông tin!")

        // Kiểm tra mật khẩu mới không trùng với mật khẩu hiện tại
        if (newPass === curPass) return toast.error('Mật khẩu mới không được trùng với mật khẩu hiện tại.');

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu phải khớp
        if (newPass !== confirmPass) return toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');

        return true;
    };

    const handleSubmit = () => {
        if (validatePassword()) {
            onChangePass(curPass, newPass);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                <Title text1="Đổi" text2="Mật Khẩu"/>
            </h2>
            <p className="text-gray-500 mb-4">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>

            <label className="block mb-2">Mật khẩu hiện tại </label>
            <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={curPass}
                onChange={(e) => setCurPass(e.target.value)}
            />

            <label className="block mb-2">Mật khẩu mới</label>
            <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mb-4" 
                value={newPass} // sửa thành newPass
                onChange={(e) => setNewPass(e.target.value)}
            />

            <label className="block mb-2">Xác nhận mật khẩu mới</label>
            <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
            />

            <button
                onClick={handleSubmit}// sửa thành callback function
                className="bg-orange-500 text-white px-4 py-2 rounded"
            >
                Xác nhận
            </button>
        </div>
    );
};

export default PasswordTab;
