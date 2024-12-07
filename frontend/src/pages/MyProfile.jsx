import { useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProfileTab from '../components/profilePage/ProfileTab'
import PasswordTab from '../components/profilePage/PasswordTab';
import AddressTab from '../components/profilePage/AddressTab';
import { deleteAdress, getAddress, createAddress, updateAddress} from '../fetchAPI/fetchAddress';
import { updateProfile, getProfile, changePass } from '../fetchAPI/fetchAccount';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'


//---
const MyProfile = () => {
    const {navigate } = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'profile';


    const [account, setAccount] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingAddress, setLoadingAddress] = useState(true);

    // Cập nhật tab đang hoạt động khi initialTab thay đổi (dựa trên query params)
    useEffect(() => {
        const tab = searchParams.get('tab');
     
        setActiveTab(tab || 'profile' );

        if (!Cookies.get("username")) {
            const currentTab = location.search; // Lấy query parameter hiện tại (vd: ?tab=profile)
            return navigate("/Login", { state: { from: location.pathname + currentTab } });
        }
    }, [searchParams]);

   
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                setAccount(response);
                console.log("Lấy thông tin cá nhân thành công:", response);
            } catch (err) {
                console.log("Lấy thông tin người dùng thất bại", err);
            } finally {
                setIsLoading(false); // Kết thúc trạng thái tải
            }
        };
        fetchProfile();
    }, []);


    const handleTabChange = (newTab) => {
        setActiveTab(newTab); // Cập nhật state
        setSearchParams({ tab: newTab }); // Cập nhật query param
    };


    // Hàm cập nhật thông tin tài khoản
    const handleSave = async (updatedAccount) => {
        try {
            console.log(updatedAccount)
            await updateProfile(updatedAccount);
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
            await changePass(body);
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
                try {
                    const data = await getAddress();
                    setAddresses(data);
                } catch(err) {
                    console.log("Lỗi khi tải địa chỉ", err);
                } finally{
                    setLoadingAddress(false);
                }
            };
            fetchAddresses();
        }
    }, [activeTab]);
    
    // Hàm thêm địa chỉ mới
    const handleAddAddress = useCallback(async (newAddress) => {
        try {
            await createAddress(newAddress);
            const response = await getAddress();
            setAddresses(response);
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
            console.log("sua", updatedAddress);
            await updateAddress(updatedAddress);
            setAddresses((prevAddresses) =>
                prevAddresses.map(address => 
                    address.id === updatedAddress.Id ? updatedAddress : address
                )
            );
            toast.success("Cập nhật địa chỉ thành công!");
        } catch(err) {
            toast.error("Cập nhật địa chỉ thất bại, vui lòng thử lại!");
        } 
    }, []);

    return (
        <div className="flex min-h-screen border-t pt-16">
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
                        onClick={() => handleTabChange("address")} 
                        className={`cursor-pointer py-2 ${activeTab === "address" ? "text-orange-600 font-bold" : ""}`}
                    >
                        Địa chỉ mua hàng
                    </li>
                </ul>
            </div>

            {/* Content tab */}
            <div className="w-3/4 p-6 bg-white">
                {activeTab === "profile" && (
                    isLoading 
                        ? <div>Đang tải...</div> 
                        : <ProfileTab account={account} onSave={handleSave} />
                )}
                {activeTab === "password" && <PasswordTab onChangePass={handleForgotPass} />}
                {activeTab === "address" && (
                    loadingAddress 
                        ? <div>Đang tải...</div> 
                        :<AddressTab 
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
