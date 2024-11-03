import { useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProfileTab from '../components/profilePage/ProfileTab'
import PasswordTab from '../components/profilePage/PasswordTab';
import AddressTab from '../components/profilePage/AddressTab';
import { delAdress, updAddress, getAddress } from '../fetchAPI/fetchAddress';
import { updateAccount, fetchAccount } from '../fetchAPI/fetchAccount';
import { toast } from 'react-toastify';

const MyProfile = () => {
    const { account, setAccount } = useContext(ShopContext);
    const [addresses, setAddresses] = useState([]);
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Cập nhật tab đang hoạt động khi initialTab thay đổi (dựa trên query params)
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    // Hàm cập nhật thông tin tài khoản
    const handleSave = async (updatedAccount) => {
        try {
            const response = await updateAccount(account, updatedAccount);
            if (response.status === 200) {
                alert("Cập nhật thông tin thành công!");
                const freshAccount = await fetchAccount(account.id);
                setAccount(freshAccount);
            } else {
                alert("Cập nhật thất bại.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            alert("Đã xảy ra lỗi trong quá trình cập nhật.");
        }
    };

    // Hàm đổi mật khẩu
    const handleForgotPass = async (curPass, newPass) => {
        if (curPass !== account.pass) {
            toast.error("Mật khẩu hiện tại sai!");
            return;
        }
        const updateData = { pass: newPass };
        try {
            const response = await updateAccount(account.id, updateData);
            if (response.status === 200) {
                alert("Đổi mật khẩu thành công!");
                const freshAccount = await fetchAccount(account.id);
                setAccount(freshAccount);
            } else {
                alert("Cập nhật thất bại.");
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            alert("Đã xảy ra lỗi trong quá trình đổi mật khẩu.");
        }
    };

    // Lấy danh sách địa chỉ khi component lần đầu render
    useEffect(() => {
        // Lấy danh sách địa chỉ
        const fetchAddresses = async () => {
            const data = await getAddress();
            setAddresses(data);
        };

        fetchAddresses(); 
    }, []);

    // Hàm thêm địa chỉ mới
    const handleAddAddress = useCallback((newAddress) => {
        setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    }, []);

    // Hàm xóa địa chỉ
    const handleDeleteAddress = useCallback(async (id) => {
        await delAdress(id);
        setAddresses((prevAddresses) => prevAddresses.filter(item => item.id !== id));
    }, []);

    // Hàm cập nhật địa chỉ
    const handleUpdateAddress = useCallback((updatedAddress) => {
        setAddresses((prevAddresses) =>
            prevAddresses.map(address => 
                address.id === updatedAddress.id ? updatedAddress : address
            )
        );
    }, []);

    return (
        <div className="flex">
            {/* Sidebar tab */}
            <div className="w-1/4 p-4">
                <h2 className="text-xl font-bold mb-4">Tài Khoản Của Tôi</h2>
                <ul>
                    <li 
                        onClick={() => setActiveTab("profile")} 
                        className={`cursor-pointer py-2 ${activeTab === "profile" ? "text-orange-600 font-bold" : ""}`}
                    >
                        Hồ Sơ
                    </li>
                    <li 
                        onClick={() => setActiveTab("password")} 
                        className={`cursor-pointer py-2 ${activeTab === "password" ? "text-orange-600 font-bold" : ""}`}
                    >
                        Đổi Mật Khẩu
                    </li>
                    <li 
                        onClick={() => setActiveTab("address")} 
                        className={`cursor-pointer py-2 ${activeTab === "address" ? "text-orange-600 font-bold" : ""}`}
                    >
                        Địa chỉ mua hàng
                    </li>
                </ul>
            </div>

            {/* Content tab */}
            <div className="w-3/4 p-6 bg-white">
                {activeTab === "profile" && <ProfileTab account={account} onSave={handleSave} />}
                {activeTab === "password" && <PasswordTab onChangePass={handleForgotPass} />}
                {activeTab === "address" && (
                    <AddressTab 
                        addresses={addresses} 
                        onAddAddress={handleAddAddress} 
                        onDeleteAddress={handleDeleteAddress} 
                        onUpdateAddress={handleUpdateAddress}
                    />
                )}
            </div>
        </div>
    );
};

export default MyProfile;
