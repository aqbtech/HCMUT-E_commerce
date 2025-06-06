import { useState } from 'react';
import Cookies from 'js-cookie'
import Title from "../Title.jsx";
import {toast} from "react-toastify";


const ProfileTab = ({ account, onSave }) => {
    const [name, setName] = useState(account.lastName);
    const [Hovatendem, setHovatendem] = useState(account.firstName);
    const [email, setEmail] = useState(account.email);
    const [phone, setPhone] = useState(account.phone);
    const [gender, setGender] = useState(account.sex || "Nam");
    const [birthday, setBirthday] = useState(account.dob);

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

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                <Title text1="Hồ Sơ" text2="Của Tôi"/>
            </h2>
            <p className="text-gray-500 mb-4">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <label className="block mb-2">Tên đăng nhập</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-500"
                           value={Cookies.get("username")} readOnly/>

                    <label className="block mb-2">Họ và tên đệm</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" value={Hovatendem}
                           onChange={(e) => setHovatendem(e.target.value)}/>

                    <label className="block mb-2">Tên</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" value={name}
                           onChange={(e) => setName(e.target.value)}/>

                    <label className="block mb-2">Email</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" value={email}
                           onChange={(e) => setEmail(e.target.value)}/>

                    <label className="block mb-2">Số điện thoại</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" value={phone}
                           onChange={(e) => setPhone(e.target.value)}/>

                    <label className="block mb-2">Giới tính</label>
                    <div className="flex items-center gap-4 mb-4">
                        <label>
                            <input type="radio" name="gender" className="mr-1" checked={gender === "Nam"}
                                   onChange={() => setGender("Nam")}/>
                            Nam
                        </label>
                        <label>
                            <input type="radio" name="gender" className="mr-1" checked={gender === "Nữ"}
                                   onChange={() => setGender("Nữ")}/>
                            Nữ
                        </label>
                        <label>
                            <input type="radio" name="gender" className="mr-1" checked={gender === "Khác"}
                                   onChange={() => setGender("Khác")}/>
                            Khác
                        </label>
                    </div>

                    <label className="block mb-2">Ngày sinh</label>
                    <input className="w-full p-2 border border-gray-300 rounded mb-4" type='date' value={birthday}
                           onChange={(e) => setBirthday(e.target.value)}/>

                    <button
                        type='button'
                        onClick={() => {
                            if (validateInputs()) {
                                onSave({
                                    lastName: name,
                                    firstName: Hovatendem,
                                    email: email,
                                    phone: phone,
                                    DOB: birthday,
                                    sex: gender
                                });
                            }
                        }}
                        className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-black hover:text-white"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
 