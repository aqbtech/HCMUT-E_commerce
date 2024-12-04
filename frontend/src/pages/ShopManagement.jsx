import { useState } from 'react';
import ProductManagement from '../components/shopPage/ProductManagement';
import OrderManagement from '../components/shopPage/OrderManagement';
import ShopInfo from '../components/shopPage/ShopInfo';

const ShopManagement = () => {
    const [activeTab, setActiveTab] = useState('product'); // Default tab: ProductManagement

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-1/4 text-black p-4">
                <h2 className="text-xl font-bold mb-6">Shop Management</h2>
                <ul>
                    <li
                        onClick={() => setActiveTab('product')}
                        className={`cursor-pointer py-2 ${
                            activeTab === 'product' ? 'text-orange-400 font-bold' : 'hover:text-gray-300'
                        }`}
                    >
                        Product Management
                    </li>
                    <li
                        onClick={() => setActiveTab('order')}
                        className={`cursor-pointer py-2 ${
                            activeTab === 'order' ? 'text-orange-400 font-bold' : 'hover:text-gray-300'
                        }`}
                    >
                        Order Management
                    </li>
                    <li
                        onClick={() => setActiveTab('shop')}
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