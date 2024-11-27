import { useState } from "react";
import { toast } from 'react-toastify'; // Use toast notifications

const BankModal = ({ onClose, onSave, isLoading }) => {
    const [accountNumber, setAccountNumber] = useState("");
    const [bankName, setBankName] = useState("");
    const [name, setName] = useState("");

    // Handle save logic with validation
    const handleSave = () => {
        if (accountNumber && bankName && name) {
            onSave({ accountNumber, bankName, name });
        } else {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-1/3">
                <h2 className="text-xl font-bold mb-4">Thêm tài khoản ngân hàng</h2>
                <div className="mb-4">
                    <label className="block font-semibold">Ngân hàng:</label>
                    <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        disabled={isLoading} // Disable inputs when loading
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Số tài khoản:</label>
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        disabled={isLoading} // Disable inputs when loading
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Tên tài khoản:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        disabled={isLoading} // Disable inputs when loading
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isLoading} // Disable button while saving
                        className={`px-4 py-2 rounded ${isLoading ? "bg-gray-400" : "bg-orange-500 text-white hover:bg-orange-600"}`}
                    >
                        {isLoading ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading} // Disable button while saving
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
