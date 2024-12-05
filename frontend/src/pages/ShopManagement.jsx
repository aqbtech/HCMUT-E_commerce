import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import ProductManagement from '../components/shopPage/ProductManagement';
import OrderManagement from '../components/shopPage/OrderManagement';
import ShopInfo from '../components/shopPage/ShopInfo';
import { ShopContext } from '../context/ShopContext';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { checkStatus } from '../fetchAPI/fetchAccount';

const ShopManagement = () => {
    const { navigate } = useContext(ShopContext); 
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation(); // Để lấy đường dẫn hiện tại
    const initialTab = searchParams.get('tab') || 'product'; 
    const [activeTab, setActiveTab] = useState(initialTab);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const tab = searchParams.get('tab') || 'product';
        setActiveTab(tab);

        // Kiểm tra cookie
        if (!Cookies.get("username")) {
            const currentTab = location.search;
            navigate('/Login', { state: { from: location.pathname + currentTab } });
        }
    }, [searchParams, location]);


    //Kiem tra xem nguoi ban da dc duyet chưa?
    useEffect(()=> {
        const fetchStatus = async () => {
            try {
                const response = await checkStatus();
                if(response) setStatus(true);
            } catch(err) {
                toast.error("Lỗi khi kiểm tra trạng thái người bán!");
            }
        }

        fetchStatus()
    }, [])

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setSearchParams({ tab: newTab }); 
    };

    if (!status) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded shadow-lg text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Đang Xử Lý</h2>
                    <p className="text-gray-700">
                        Đơn đăng ký của bạn đang chờ để được xử lý. Vui lòng quay lại sau khi admin đã duyệt tài khoản của bạn.
                    </p>
                    <div className="mt-6">
                        <img
                            src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-hourglass-website-flatart-icons-outline-flatarticons.png"
                            alt="Processing"
                            className="mx-auto w-16 h-16"
                        />
                    </div>
                    <div className="mt-6">
                        <Link
                            to='/'
                            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-300"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-1/4 text-black p-4">
                <h2 className="text-xl font-bold mb-6">Shop Management</h2>
                <ul>
                    <li
                        onClick={() => handleTabChange('product')}
                        className={`cursor-pointer py-2 ${
                            activeTab === 'product' ? 'text-orange-400 font-bold' : 'hover:text-gray-300'
                        }`}
                    >
                        Product Management
                    </li>
                    <li
                        onClick={() => handleTabChange('order')}
                        className={`cursor-pointer py-2 ${
                            activeTab === 'order' ? 'text-orange-400 font-bold' : 'hover:text-gray-300'
                        }`}
                    >
                        Order Management
                    </li>
                    <li
                        onClick={() => handleTabChange('shop')}
                        className={`cursor-pointer py-2 ${
                            activeTab === 'shop' ? 'text-orange-400 font-bold' : 'hover:text-gray-300'
                        }`}
                    >
                        Shop Info
                    </li>
                </ul>
            </div>

            {/* Content */}
            <div className="w-3/4 p-6 bg-white">
                {activeTab === 'product' && <ProductManagement />}
                {activeTab === 'order' && <OrderManagement />}
                {activeTab === 'shop' && <ShopInfo />}
            </div>
        </div>
    );
};

export default ShopManagement;