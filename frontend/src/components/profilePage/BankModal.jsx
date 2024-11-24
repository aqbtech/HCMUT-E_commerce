import { useState } from "react";

const BankModal = ({ onClose, onSave, isLoading }) => {
    const [accountNumber, setAccountNumber] = useState("");
    const [bankName, setBankName] = useState("");

    const handleSave = () => {
        if (accountNumber && bankName) {
            onSave({ accountNumber, bankName });
        } else {
            alert("Vui lòng nhập đầy đủ thông tin!");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-1/3">
                <h2 className="text-xl font-bold mb-4">Thêm tài khoản ngân hàng</h2>
                <div className="mb-4">
                    <label className="block font-semibold">Số tài khoản:</label>
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        disabled={isLoading} // Không cho chỉnh sửa khi đang lưu
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Ngân hàng:</label>
                    <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        disabled={isLoading} // Không cho chỉnh sửa khi đang lưu
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isLoading} // Vô hiệu hóa nút khi đang lưu
                        className={`px-4 py-2 rounded ${
                            isLoading
                                ? "bg-gray-400"
                                : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}
                    >
                        {isLoading ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading} // Không cho đóng modal khi đang lưu
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankModal;
