import { useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProfileTab from '../components/profilePage/ProfileTab'
import PasswordTab from '../components/profilePage/PasswordTab';
import AddressTab from '../components/profilePage/AddressTab';
import { deleteAdress, updateAddress, getAddress, createAddress} from '../fetchAPI/fetchAddress';
import {getBankAccounts,createBankAccount } from '../fetchAPI/fetchBank';
import { updateAccount, getInfo } from '../fetchAPI/fetchAccount';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'
import BankTab from '../components/profilePage/BankTab';
import BankModal from '../components/profilePage/BankModal';


//---
const MyProfile = () => {
    const { account, navigate } = useContext(ShopContext);
    const [addresses, setAddresses] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [bankAccounts, setBankAccounts] = useState([]); // Danh sách tài khoản ngân hàng
    const [isModalOpen, setIsModalOpen] = useState(false); // Kiểm soát hiển thị modal

    // Cập nhật tab đang hoạt động khi initialTab thay đổi (dựa trên query params)
    useEffect(() => {
        const tab = searchParams.get('tab') || 'profile';
        setActiveTab(tab);

        if (!Cookies.get("username")) {
            const currentTab = location.search; // Lấy query parameter hiện tại (vd: ?tab=profile)
            return navigate("/Login", { state: { from: location.pathname + currentTab } });
        }
    }, [searchParams]);


    const handleTabChange = (newTab) => {
        setActiveTab(newTab); // Cập nhật state
        setSearchParams({ tab: newTab }); // Cập nhật query param
    };


    // Hàm cập nhật thông tin tài khoản
    const handleSave = async (updatedAccount) => {
        try {
            const response = await updateAccount(account, updatedAccount);
            toast.success("Cập nhật thông tin thành công!");
        } catch(err)  {
            console.error("Lỗi khi cập nhật tài khoản:", err);
            toast.error("Cập nhật thất bại, vui lòng thử lại!");
        }
    };

    // Hàm đổi mật khẩu
    const handleForgotPass = async (curPass, newPass) => {
        const body = {
            "password" : curPass,
            "newPassword" : newPass
        }
        try {
            const response = await updateAccount(body);
            toast.success("Đổi mật khẩu thành công!");
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            toast.error("Đổi mật khẩu thất bại, vui lòng thử lại!");
        }
    };

    // Lấy danh sách địa chỉ khi component lần đầu render
    useEffect(() => {
        if (activeTab === 'address') {
            const fetchAddresses = async () => {
                const data = await getAddress();
                setAddresses(data);
            };

            fetchAddresses();
        }
    }, [activeTab]);
    
    // Hàm thêm địa chỉ mới
    const handleAddAddress = useCallback(async (newAddress) => {
        try {
            await createAddress(newAddress);
            setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
            toast.success("Thêm địa chỉ giao hàng thành công!");
        } catch(err) {
            toast.error("Thêm địa chỉ mới thất bại, vui lòng thử lại!");
        }
    }, []);
    
    // Hàm xóa địa chỉ
    const handleDeleteAddress = useCallback(async (id) => { 
        try {
            await deleteAdress(id);
            setAddresses((prevAddresses) => prevAddresses.filter(item => item.id !== id));
            toast.success("Xóa địa chỉ thành công!");
        } catch(err) {
            toast.error("Xóa địa chỉ thất bại, vui lòng thử lại!");
        }
    }, []);

    // Hàm cập nhật địa chỉ
    const handleUpdateAddress = useCallback(async (updatedAddress) => {
        try {
            await createAddress(updatedAddress);
            setAddresses((prevAddresses) =>
                prevAddresses.map(address => 
                    address.id === updatedAddress.id ? updatedAddress : address
                )
            );
            toast.success("Cập nhật địa chỉ thành công!");
        } catch(err) {
            toast.error("Cập nhật địa chỉ thất bại, vui lòng thử lại!");
        } 
    }, []);

    // Lấy danh sách tài khoản ngân hàng khi component render
    useEffect(() => {
        if (activeTab === 'bank') {
            const fetchBankAccounts = async () => { 
                const data = await getBankAccounts(); 
                setBankAccounts(data);
            };
            fetchBankAccounts();
        }
    }, [activeTab]);


    // Hàm thêm tài khoản ngân hàng mới
    const handleAddBankAccount = async (newBankAccount) => {
        try {
            await createBankAccount(newBankAccount); 
            setBankAccounts((prev) => [...prev, newBankAccount]);
            toast.success("Thêm tài khoản ngân hàng thành công!");
        } catch (err) {
            toast.error("Thêm tài khoản ngân hàng thất bại!");
        }
    };
    

    return (
        <div className="flex">
            {/* Sidebar tab */}
            <div className="w-1/4 p-4">
                <h2 className="text-xl font-bold mb-4">Tài Khoản Của Tôi</h2>
                <ul>
                    <li 
                        onClick={() => handleTabChange("profile")} 
                        className={`cursor-pointer py-2 ${activeTab === "profile" ? "text-orange-600 font-bold" : ""}`}
                    >
                        Hồ Sơ
                    </li>
                    <li 
                        onClick={() => handleTabChange("password")} 
                        className={`cursor-pointer py-2 ${activeTab === "password" ? "text-orange-600 font-bold" : ""}`}
                    >
                        Đổi Mật Khẩu
                    </li>
                    <li 
                        onClick={() => handleTabChange("bank")} 
                        className={`cursor-pointer py-2 ${activeTab === "bank" ? "text-orange-600 font-bold" : ""}`}
                    >
                        Tài Khoản Ngân Hàng
                    </li>
                    <li 
                        onClick={() => handleTabChange("address")} 
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
                {activeTab === "bank" && (
                    <>
                        <BankTab 
                            bankAccounts={bankAccounts} 
                            onAddAccount={() => setIsModalOpen(true)} 
                            setBankAccounts={setBankAccounts}
                        />
                        {isModalOpen && (
                            <BankModal 
                                onClose={() => setIsModalOpen(false)} 
                                onSave={handleAddBankAccount} 
                            />
                        )}
                    </>
                )}

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
