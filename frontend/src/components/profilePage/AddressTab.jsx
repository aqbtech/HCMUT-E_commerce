import { useState } from 'react';
import AddressModal from './AddressModal';
import Title from "../Title.jsx";

const AddressTab = ({ addresses, onAddAddress, onDeleteAddress, onUpdateAddress }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null); // Địa chỉ được chọn để cập nhật
    const [isCreatingNew, setIsCreatingNew] = useState(true); // Trạng thái để phân biệt thêm mới hay cập nhật

    const handleAddAddress = (newAddress) => {
        onAddAddress(newAddress); // Gọi hàm thêm mới từ props
        setIsModalOpen(false); // Đóng modal
    };

    const handleUpdateAddress = (updatedAddress) => {
        onUpdateAddress(updatedAddress); // Gọi hàm cập nhật từ props
        setIsModalOpen(false); // Đóng modal
        setSelectedAddress(null); // Xóa trạng thái địa chỉ đã chọn
    };

    return (

        <div className="">
            <h2 className="text-2xl font-bold mb-4">
                <Title text1="Địa Chỉ" text2="Giao Hàng"/>
            </h2>
            {/* Nút Thêm địa chỉ mới căn phải */}
            <div className="text-right mb-4">
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setSelectedAddress(null); // Reset địa chỉ được chọn
                        setIsCreatingNew(true); // Đặt trạng thái tạo mới
                    }}
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
                            <p className="font-semibold">
                                {address.name} <span className="text-gray-500">({address.phone})</span>
                            </p>
                            <p>{address.detailAddress}</p>
                            <p className="text-gray-500">
                                {address.province}, {address.district}, {address.ward}
                            </p>
                        </div>

                        {/* Nút thao tác */}
                        <div className="flex flex-col items-end space-y-2">
                            <button
                                onClick={() => {
                                    setSelectedAddress(address); // Lưu địa chỉ vào state để cập nhật
                                    setIsModalOpen(true); // Mở modal
                                    setIsCreatingNew(false); // Đặt trạng thái cập nhật
                                }}
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
                    onClose={() => {
                        setIsModalOpen(false); // Đóng modal
                        setSelectedAddress(null); // Reset địa chỉ đã chọn
                    }}
                    onSave={isCreatingNew ? handleAddAddress : handleUpdateAddress} // Truyền hàm phù hợp
                    initialData={isCreatingNew ? null : selectedAddress} // Chỉ truyền dữ liệu nếu đang cập nhật
                />
            )}
        </div>
    );
};

export default AddressTab;
