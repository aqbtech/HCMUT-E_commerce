import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import Title from "../Title.jsx";
import {toast} from "react-toastify";
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaBirthdayCake } from "react-icons/fa";

const ProfileTab = ({ account, onSave, isEditing, toggleEditing }) => {
    const [name, setName] = useState('');
    const [Hovatendem, setHovatendem] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');

    useEffect(() => {
        // Update local state when account prop changes
        setName(account.lastName || '');
        setHovatendem(account.firstName || '');
        setEmail(account.email || '');
        setPhone(account.phone || '');
        setBirthday(account.dob || '');
    }, [account]);

    const validateInputs = () => {
        // Kiểm tra các trường rỗng
        if (!name.trim() || !Hovatendem.trim() || !email.trim() || !phone.trim() || !birthday) {
            toast.error("Bạn chưa điền đủ thông tin!");
            return false;
        }

        // Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Email không hợp lệ!");
            return false;
        }

        // Kiểm tra số điện thoại (10 chữ số, bắt đầu bằng số 0)
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phone)) {
            toast.error("Số điện thoại không hợp lệ!");
            return false;
        }

        // Kiểm tra ngày sinh không được là ngày tương lai
        const today = new Date();
        const selectedDate = new Date(birthday);
        if (selectedDate > today) {
            toast.error("Ngày sinh không hợp lệ! Không được chọn ngày trong tương lai.");
            return false;
        }

        // Tất cả đều hợp lệ
        return true;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave({
                lastName: name,
                firstName: Hovatendem,
                email: email,
                phone: phone,
                DOB: birthday,
                sex: account.sex || "Nam" // Keep existing gender value
            });
            toggleEditing(false);
        }
    };

    const handleCancel = () => {
        // Reset to original values
        setName(account.lastName || '');
        setHovatendem(account.firstName || '');
        setEmail(account.email || '');
        setPhone(account.phone || '');
        setBirthday(account.dob || '');
        toggleEditing(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-1">
                        <Title text1="Hồ Sơ" text2="Của Tôi"/>
                    </h2>
                    <p className="text-gray-500">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>
                
                {!isEditing ? (
                    <button 
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={() => toggleEditing(true)}
                    >
                        <FaEdit /> Chỉnh sửa
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button 
                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            onClick={handleCancel}
                        >
                            <FaTimes /> Hủy
                        </button>
                        <button 
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            onClick={handleSave}
                        >
                            <FaSave /> Lưu thông tin
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 border-b pb-2">
                        <FaUser className="text-blue-500" /> Thông tin tài khoản
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Tên đăng nhập</label>
                            <input 
                                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
                                value={Cookies.get("username")} 
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Họ và tên đệm</label>
                            <input 
                                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg transition-colors`}
                                value={Hovatendem}
                                onChange={(e) => setHovatendem(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Tên</label>
                            <input 
                                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg transition-colors`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 border-b pb-2">
                        <FaEnvelope className="text-green-500" /> Thông tin liên hệ
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                                <FaEnvelope className="text-blue-500" /> Email
                            </label>
                            <input 
                                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg transition-colors`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                                <FaPhone className="text-blue-500" /> Số điện thoại
                            </label>
                            <input 
                                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg transition-colors`} 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                                <FaBirthdayCake className="text-red-500" /> Ngày sinh
                            </label>
                            <input 
                                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg transition-colors`} 
                                type='date' 
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
 