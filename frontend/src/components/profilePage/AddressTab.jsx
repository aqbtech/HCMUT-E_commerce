// src/components/AddressTab.js
import { useState } from 'react';
import AddressModal from './AddressModal';

const AddressTab = ({ addresses, onAddAddress, onDeleteAddress, onUpdateAddress }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null); // Địa chỉ được chọn để cập nhật

    const handleUpdateClick = (address) => {
        setSelectedAddress(address); // Lưu địa chỉ vào state
        setIsModalOpen(true); // Mở modal 
    };
 
    const handleSaveAddress = (newAddress) => {
        if (selectedAddress) {
            onUpdateAddress({ ...selectedAddress, ...newAddress }); // Gọi hàm cập nhật nếu có địa chỉ được chọn
        } else {
            onAddAddress(newAddress); // Gọi hàm thêm nếu không có địa chỉ nào đang chọn
        }
        setIsModalOpen(false);
        setSelectedAddress(null);
    };

    return (
        <div className="p-4">
            {/* Nút Thêm địa chỉ mới căn phải */} 
            <div className="text-right mb-4">
                <button 
                    onClick={() => { setIsModalOpen(true); setSelectedAddress(null); }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    + Thêm địa chỉ mới
                </button>
            </div>

            {/* Danh sách địa chỉ */}
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Địa chỉ</h2>
                {addresses.map((address) => (
                    <div 
                        key={address.id} 
                        className="border-b border-gray-300 py-4 flex justify-between items-start"
                    >
                        {/* Thông tin địa chỉ */}
                        <div>
                            <p className="font-semibold">{address.name} <span className="text-gray-500">({address.phone})</span></p>
                            <p>{address.detailAddress}</p>
                            <p className="text-gray-500">{address.city}, {address.province}</p>
                        </div>

                        {/* Nút thao tác */}
                        <div className="flex flex-col items-end space-y-2">
                            <button 
                                onClick={() => handleUpdateClick(address)}
                                className="text-blue-500"
                            >
                                Cập nhật
                            </button>
                            <button 
                                onClick={() => onDeleteAddress(address.id)} 
                                className="text-red-500"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal thêm/cập nhật địa chỉ */}
            {isModalOpen && (
                <AddressModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSaveAddress} 
                    initialData={selectedAddress} // Truyền dữ liệu hiện có cho modal
                />
            )}
        </div>
    );
};

export default AddressTab;
