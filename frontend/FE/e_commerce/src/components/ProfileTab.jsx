// src/components/ProfileTab.js
import React, { useState } from 'react';

const ProfileTab = ({ account, onSave }) => {
    const [username, setUsername] = useState(account.id);
    const [name, setName] = useState(account.ten);
    const [Hovatendem, setHovatendem] = useState(account.Hovatendem);
    const [email, setEmail] = useState(account.email);
    const [phone, setPhone] = useState(account.sdt);
    const [gender, setGender] = useState("Nam");
    const [birthday, setBirthday] = useState(account.date);

    return ( 
        <div>
            <h2 className="text-2xl font-bold mb-2">Hồ Sơ Của Tôi</h2>
            <p className="text-gray-500 mb-4">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <label className="block mb-2">Tên đăng nhập</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-500" value={username} readOnly />

                    <label className="block mb-2">Họ và tên đệm</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" value={Hovatendem} onChange={(e) => setHovatendem(e.target.value)} />

                    <label className="block mb-2">Tên</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" value={name} onChange={(e) => setName(e.target.value)} />

                    <label className="block mb-2">Email</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label className="block mb-2">Số điện thoại</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" value={phone} onChange={(e) => setPhone(e.target.value)} />

                    <label className="block mb-2">Giới tính</label>
                    <div className="flex items-center gap-4 mb-4">
                        <label>
                            <input type="radio" name="gender" className="mr-1" checked={gender === "Nam"} onChange={() => setGender("Nam")} />
                            Nam
                        </label>
                        <label>
                            <input type="radio" name="gender" className="mr-1" checked={gender === "Nữ"} onChange={() => setGender("Nữ")} />
                            Nữ
                        </label>
                        <label>
                            <input type="radio" name="gender" className="mr-1" checked={gender === "Khác"} onChange={() => setGender("Khác")} />
                            Khác
                        </label>
                    </div>

                    <label className="block mb-2">Ngày sinh</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" type='date' value={birthday} onChange={(e) => setBirthday(e.target.value)} />

                    <button type='button' onClick={() => onSave({ id: username, ten: name, Hovatendem, email, sdt: phone, date: birthday })} className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-black hover:text-white">Lưu</button>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <span className="text-gray-400 text-4xl">👤</span>
                    </div>
                    <button className="bg-gray-300 px-4 py-2 rounded hover:bg-black hover:text-white">Chọn Ảnh</button>
                    <p className="text-gray-500 text-sm mt-2">Dung lượng tối đa 1MB, định dạng .JPEG, .PNG</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
