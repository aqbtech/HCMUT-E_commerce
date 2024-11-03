import { useState, useEffect } from "react";
import { addAddress, updateAddress } from "../../fetchAPI/fetchAddress"; // Import hàm update nếu cần

const CreateAddress = ({ onClose, onSave, initialData = {} }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [addressType, setAddressType] = useState('Nhà Riêng');
    const [province, setProvince] = useState('');

    // Cập nhật các trường khi nhận initialData (khi mở modal cập nhật)
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setPhone(initialData.phone || '');
            setCity(initialData.city || '');
            setDetailAddress(initialData.detailAddress || '');
            setAddressType(initialData.addressType || 'Nhà Riêng');
            setProvince(initialData.province || '');
        } 
    }, [initialData]);

    const handleSave = () => {
        const addressData = {
            name,
            phone,
            city,
            province,
            detailAddress,
            addressType,
        };

        if (initialData && initialData.id) {
            // Cập nhật địa chỉ nếu có ID
            updateAddress(initialData.id, addressData); // Hàm update tùy theo API của bạn
            onSave({ ...addressData, id: initialData.id });
        } else {
            // Thêm mới nếu không có ID
            addAddress(addressData);
            onSave(addressData); 
        }
        onClose();
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

                <input
                    type="text"
                    placeholder="Tỉnh/Thành phố"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <input
                    type="text"
                    placeholder="Quận/Huyện"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <input
                    type="text"
                    placeholder="Địa chỉ cụ thể"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <div className="mb-4">
                    <p className="font-semibold">Loại địa chỉ:</p>
                    <button
                        className={`px-4 py-2 mr-2 rounded ${addressType === 'Nhà Riêng' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setAddressType('Nhà Riêng')}
                    >
                        Nhà Riêng
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${addressType === 'Văn Phòng' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setAddressType('Văn Phòng')}
                    >
                        Văn Phòng
                    </button>
                </div>

                <div className="flex justify-between">
                    <button onClick={onClose} className="text-gray-600 hover:underline">Trở Lại</button>
                    <button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 rounded">
                        {initialData ? 'Cập nhật' : 'Hoàn thành'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAddress;
