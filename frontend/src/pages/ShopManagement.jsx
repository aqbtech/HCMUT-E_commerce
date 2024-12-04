import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import ProductManagement from '../components/shopPage/ProductManagement';
import OrderManagement from '../components/shopPage/OrderManagement';
import ShopInfo from '../components/shopPage/ShopInfo';
import { ShopContext } from '../context/ShopContext';
import Cookies from 'js-cookie';

const ShopManagement = () => {
    const { navigate } = useContext(ShopContext); 
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation(); // Để lấy đường dẫn hiện tại
  

    const initialTab = searchParams.get('tab') || 'product'; 
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tab = searchParams.get('tab') || 'product';
        setActiveTab(tab);

        // Kiểm tra cookie
        if (!Cookies.get("username")) {
            const currentTab = location.search;
            navigate('/Login', { state: { from: location.pathname + currentTab } });
        }
    }, [searchParams, location]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setSearchParams({ tab: newTab }); 
    };
    return (
        <div className="flex">
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