// src/pages/MyProfile.js
import { useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { updateAccount, fetchAccount } from '../../fetchAPI/fetchAccount';
import ProfileTab from '../components/ProfileTab';
import PasswordTab from '../components/PasswordTab';
import AddressTab from '../components/AddressTab';
import { deleteAddress, fetchAddresses } from '../../fetchAPI/fetchAddress';
import { toast } from 'react-toastify';

const MyProfile = () => {
    const [searchParams] = useSearchParams(); // Lấy query params từ URL
    const initialTab = searchParams.get('tab') || 'profile'; // Kiểm tra xem có tham số tab hay không
    const [activeTab, setActiveTab] = useState(initialTab);
    const { account, setAccount } = useContext(ShopContext);  
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        setActiveTab(initialTab); // Cập nhật lại activeTab khi initialTab thay đổi
      }, [initialTab]);

    //Hồ sơ
    const handleSave = async (updatedAccount) => {
        try {
            const response = await updateAccount(account.id, updatedAccount);
            if (response.status === 200) {
                alert("Cập nhật thông tin thành công!");
                const freshAccount = await fetchAccount(account.id);
                setAccount(freshAccount);
            } else {
                alert("Cập nhật thất bại.");
            }
        } catch (error) {
            console.error("Error updating account:", error);
            alert("Đã xảy ra lỗi trong quá trình cập nhật.");
        } 
    };


    //Quên mật khẩu
    const handleForgotPass = async (curPass, newPass) => {
        console.log(curPass, " ", newPass, " ", account.pass);
        if(curPass != account.pass) 
        {
            toast.error("Mật khẩu hiện tại sai!") 
            return;
        }
            const updateData = {pass: newPass}
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
            console.error("Error updating account:", error);
            alert("Đã xảy ra lỗi trong quá trình cập nhật.");
        } 
    }



    //Địa chỉ
    const getAddress = async () => {
        try {
            const response = await fetchAddresses();
            setAddresses(response);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    useEffect(() =>{
        getAddress();
    }, []);

    useEffect(() => {
        getAddress();
    }, []);

    const handleAddAddress = useCallback((newAddress) => {
        setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    }, []);

    const handleDeleteAddress = useCallback(async (id) => {
        await deleteAddress(id);
        setAddresses((prevAddresses) => prevAddresses.filter(item => item.id !== id));
    }, []);

    const handleUpdateAddress = useCallback((updatedAddress) => {
        setAddresses((prevAddresses) =>
            prevAddresses.map(address => 
                address.id === updatedAddress.id ? updatedAddress : address
            )
        );
    }, []);
    return (
        <div className="flex">
            <div className="w-1/4 p-4">
                <h2 className="text-xl font-bold mb-4">Tài Khoản Của Tôi</h2>
                <ul>
                    <li onClick={() => setActiveTab("profile")} className={`cursor-pointer py-2 ${activeTab === "profile" ? "text-orange-600 font-bold" : ""}`}>
                        Hồ Sơ
                    </li>
                    <li onClick={() => setActiveTab("password")} className={`cursor-pointer py-2 ${activeTab === "password" ? "text-orange-600 font-bold" : ""}`}>
                        Đổi Mật Khẩu
                    </li>
                    <li onClick={() => setActiveTab("address")} className={`cursor-pointer py-2 ${activeTab === "address" ? "text-orange-600 font-bold" : ""}`}>
                        Địa chỉ mua hàng
                    </li>
                </ul>
            </div>

            <div className="w-3/4 p-6 bg-white">
                {activeTab === "profile" && <ProfileTab account={account} onSave={handleSave} />}
                {activeTab === "password" && <PasswordTab onChangePass={handleForgotPass} />}
                {activeTab === "address" && <AddressTab addresses={addresses} onAddAddress={handleAddAddress} onDeleteAddress={handleDeleteAddress} onUpdateAddress={handleUpdateAddress}/>}
            </div>
        </div>
    );
};

export default MyProfile;
