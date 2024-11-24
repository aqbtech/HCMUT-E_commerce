import { useState } from 'react';
import { toast } from 'react-toastify';
import BankModal from "./BankModal";

const BankTab = ({ onSaveBankAccount, bankAccounts, setBankAccounts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 

    // Hàm xử lý khi thêm tài khoản mới
    const handleAddAccount = async (newAccount) => {
        const isDuplicate = bankAccounts.some(
            (account) => account.accountNumber === newAccount.accountNumber
        );

        if (isDuplicate) {
            toast.error("Số tài khoản đã tồn tại. Vui lòng kiểm tra lại!");
            return;
        }

        setIsLoading(true); // Hiển thị trạng thái loading
        try {
           
            if (onSaveBankAccount) {
                onSaveBankAccount(newAccount); // Gửi dữ liệu ra ngoài nếu cần
            }
            setBankAccounts((prev) => [...prev, newAccount]); // Cập nhật danh sách
            setIsModalOpen(false); // Đóng modal sau khi thêm thành công
        } catch (error) {
            console.error("Lỗi khi lưu tài khoản:", error);
            toast.error("Không thể lưu tài khoản. Vui lòng thử lại!");
        } finally {
            setIsLoading(false); // Tắt trạng thái loading
        }
    };

    return (
        <div>
            {/* Nút mở modal */}
            <div className="text-right mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Thêm tài khoản ngân hàng
                </button>
            </div>
            

            <h2 className="text-xl font-bold mb-4">Danh sách tài khoản ngân hàng</h2>
            {/* Hiển thị danh sách tài khoản hoặc thông báo khi danh sách rỗng */}
            <ul>
                {bankAccounts?.length > 0 ? (
                    bankAccounts?.map((account, index) => (
                        <li key={index} className="mb-2">
                            <div>Số tài khoản: {account.accountNumber}</div>
                            <div>Ngân hàng: {account.bankName}</div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">Chưa có tài khoản ngân hàng nào được thêm.</p>
                )}
            </ul>

            

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
