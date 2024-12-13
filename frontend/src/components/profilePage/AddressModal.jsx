import { useState, useEffect } from "react";
import { createAddress, updateAddress } from "../../fetchAPI/fetchAddress";
import { toast } from "react-toastify";

const CreateAddress = ({ onClose, onSave, initialData = {} }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [provinceCode, setProvinceCode] = useState(''); 
    const [province, setProvince] = useState(''); 
    const [districtCode, setDistrictCode] = useState(''); 
    const [district, setDistrict] = useState(''); 
    const [wardCode, setWardCode] = useState(''); 
    const [ward, setWard] = useState(''); 
    const [detailAddress, setDetailAddress] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Fetch danh sách tỉnh/thành phố
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/?depth=1');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh:', error);
            }
        };
        fetchProvinces();
    }, []);

    // Cập nhật dữ liệu ban đầu
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setPhone(initialData.phone || '');
            setDetailAddress(initialData.detailAddress || '');
            setProvince(initialData.province || '');
            setDistrict(initialData.district || '');
            setWard(initialData.ward || '');
        }
    }, [initialData]);

    const handleProvinceChange = async (e) => {
        const selectedCode = Number(e.target.value);
        const selectedProvince = provinces.find(item => item.code === selectedCode);
        setProvinceCode(selectedCode); // Cập nhật mã tỉnh
        setProvince(selectedProvince?.name || ''); // Cập nhật tên tỉnh
        setDistrictCode('');
        setDistrict('');
        setWardCode('');
        setWards([]);

        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedCode}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts || []);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách quận/huyện:', error);
        }
    };

    const handleDistrictChange = async (e) => {
        const selectedCode = Number(e.target.value);
        const selectedDistrict = districts.find(item => item.code === selectedCode);

        setDistrictCode(selectedCode);
        setDistrict(selectedDistrict?.name || '');
        setWardCode('');
        setWard('');

        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedCode}?depth=2`);
            const data = await response.json();
            setWards(data.wards || []);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách xã/phường:', error);
        }
    };

    const handleWardChange = (e) => {
        const selectedCode = Number(e.target.value);
        const selectedWard = wards.find(item => item.code === selectedCode);

        setWardCode(selectedCode);
        setWard(selectedWard?.name || '');
    };

    const handleUpdateAddress = () => {
        if(!validate()) return;
        const updatedAddress = {
            Id: initialData.id, // Đảm bảo có ID để xử lý cập nhật
            name,
            phone,
            province,
            district,
            ward,
            detailAddress,
        };

        onSave(updatedAddress); // Truyền dữ liệu lên component cha
        onClose(); // Đóng modal
    };

    const validate = () => {
        // Kiểm tra các trường bắt buộc
        if (!name.trim()) {
            toast.error('Họ và tên không được để trống!');
            return false;
        }
        if (!phone.trim()) {
            toast.error('Số điện thoại không được để trống!');
            return false;
        }
        // Kiểm tra định dạng số điện thoại (ví dụ: chỉ chấp nhận số và có độ dài tối thiểu)
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
            toast.error('Số điện thoại không hợp lệ!');
            return false;
        }
    
        if (!province) {
            toast.error('Vui lòng chọn tỉnh/thành phố!');
            return false;
        }
        if (!district) {
            toast.error('Vui lòng chọn quận/huyện!');
            return false;
        }
        if (!ward) {
            toast.error('Vui lòng chọn xã/phường!');
            return false;
        }
        if (!detailAddress.trim()) {
            toast.error('Địa chỉ cụ thể không được để trống!');
            return false;
        }
    
        // Nếu tất cả các trường hợp trên đều hợp lệ, trả về true
        return true;
    }


    const handleCreateAddress = () => {
        if(!validate()) return;
        const newAddress = {
            name,
            phone,
            province,
            district,
            ward,
            detailAddress,
        };

        onSave(newAddress); // Truyền dữ liệu lên component cha
        onClose(); // Đóng modal
    };

    const handleSave = () => {
        if (initialData && initialData.id) {
            handleUpdateAddress();
        } else {
            handleCreateAddress();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{initialData ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h2>

                <input
                    type="text"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <select
                    value={provinceCode}
                    onChange={handleProvinceChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                >
                    <option value="">{province || 'Chọn Tỉnh/Thành phố'}</option>
                    {provinces.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <select
                    value={districtCode}
                    onChange={handleDistrictChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    disabled={!provinceCode}
                >
                    <option value="">{district || 'Chọn Quận/Huyện'}</option>
                    {districts.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <select
                    value={wardCode}
                    onChange={handleWardChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    disabled={!districtCode}
                >
                    <option value="">{ward || 'Chọn Xã/Phường'}</option>
                    {wards.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Địa chỉ cụ thể"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <div className="flex justify-between">
                    <button onClick={onClose} className="text-gray-600 hover:underline">Trở Lại</button>
                    <button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 rounded">
                        {initialData ? 'Cập nhật' : 'Thêm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAddress;
