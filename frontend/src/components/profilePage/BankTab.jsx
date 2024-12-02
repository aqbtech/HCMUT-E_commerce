import { useState } from 'react';
import { toast } from 'react-toastify';
import BankModal from "./BankModal";

const BankTab = ({ bankAccounts, onSaveBankAccount, onDeleteBankAccount }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Hàm xử lý khi thêm tài khoản mới
    const handleAddAccount = (newAccount) => {
        onSaveBankAccount(newAccount); // Gửi dữ liệu ra ngoài nếu cần
        setIsModalOpen(false); // Đóng modal sau khi thêm thành công
    }

    return (
        <div>
            {/* Nút mở modal */}
            <div className="text-right mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    disabled={isLoading} // Disable the button when loading
                >
                    Thêm tài khoản ngân hàng
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Danh sách tài khoản ngân hàng</h2>
                {bankAccounts?.length > 0 ? (
                    bankAccounts.map((acc) => (
                        <div
                            key={acc.id}
                            className="border border-gray-200 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 hover:shadow-md transition-shadow"
                        >
                            {/* Thông tin tài khoản */}
                            <div className="mb-4 md:mb-0">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Số tài khoản:</span> {acc.accountNumber}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Ngân hàng:</span> {acc.bankName}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Tên tài khoản:</span> {acc.name}
                                </p>
                            </div>

                            {/* Nút thao tác */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => onDeleteBankAccount(acc.id)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                                    disabled={isLoading} // Disable the delete button when loading
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500">Chưa có tài khoản ngân hàng nào được thêm.</div>
                )}
            </div>

            {/* Hiển thị modal khi trạng thái mở */}
            {isModalOpen && (
                <BankModal
                    onClose={() => setIsModalOpen(false)} // Đóng modal
                    onSave={handleAddAccount} // Lưu tài khoản mới
                    isLoading={isLoading} // Truyền trạng thái loading vào modal
                />
            )}
        </div>
    );
};

export default BankTab;
