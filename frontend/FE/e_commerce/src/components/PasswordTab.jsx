// src/components/PasswordTab.js
import React, { useState } from 'react';

const PasswordTab = ({ onChangePass }) => {
    const [curPass, setCurPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">Đổi Mật Khẩu</h2>
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
                onClick={() => onChangePass(curPass, newPass)} // sửa thành callback function
                className="bg-orange-500 text-white px-4 py-2 rounded"
            >
                Xác nhận
            </button>
        </div>
    );
};

export default PasswordTab;
