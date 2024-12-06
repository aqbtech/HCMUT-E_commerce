import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { getShopPolicy, getCategoryPolicy } from '../../fetchAPI/fetchPolicy.jsx';

const SaleOffManagement = () => {
    const [activeTab, setActiveTab] = useState('SHOP');
    const [loading, setLoading] = useState(false);
    const [policies, setPolicies] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        size: 10,
        number: 0,
        totalElements: 0,
        totalPages: 1,
    });

    const loadPolicies = async () => {
        setLoading(true);
        try {
            const res = activeTab === 'SHOP' ? await getShopPolicy(pageInfo.number) : await getCategoryPolicy(pageInfo.number);
            setPolicies(res.content || []);
            setPageInfo(res.page || {});
        } catch (err) {
            toast.error(`Lỗi khi lấy chính sách ${activeTab === 'SHOP' ? 'shop' : 'danh mục'}!`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPolicies();
    }, [activeTab, pageInfo.number]);

    const convertSaleToPercentage = (sale) => {
        return (sale * 100).toFixed(0) + '%'; // Chuyển sale thành phần trăm
    };


    const renderTabContent = () => {
        return (
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Giảm giá {activeTab === 'SHOP' ? 'theo Shop' : 'theo Danh mục'}
                </h2>
                {policies.length > 0 ? (
                    <div className="space-y-4">
                        {policies.map((policy, index) => (
                            <div key={index} className="border p-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                                <h3 className="font-semibold text-lg">{policy.policy_name}</h3>
                                <p className="text-sm text-gray-600">{policy.policy_description}</p>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div><strong>Ngày áp dụng:</strong> {policy.apply_date}</div>
                                    <div><strong>Ngày ban hành:</strong> {policy.apply_date || 'Chưa có'}</div>
                                    <div><strong>Tỷ lệ giảm:</strong> {convertSaleToPercentage(policy.sale)}</div>
                                    <div><strong>Số lượt sử dụng:</strong> {policy.count}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Chưa có chính sách giảm giá.</p>
                )}

                <div className="flex justify-between items-center mt-4">
                    <button
                        disabled={pageInfo.number === 0}
                        onClick={() => setPageInfo((prev) => ({ ...prev, number: prev.number - 1 }))}
                        className={`px-4 py-2 rounded-lg ${
                            pageInfo.number === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Trang trước
                    </button>
                    <span>
                        Trang {pageInfo.number + 1} / {pageInfo.totalPages}
                    </span>
                    <button
                        disabled={pageInfo.number + 1 === pageInfo.totalPages}
                        onClick={() => setPageInfo((prev) => ({ ...prev, number: prev.number + 1 }))}
                        className={`px-4 py-2 rounded-lg ${
                            pageInfo.number + 1 === pageInfo.totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        Trang sau
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="border-t pt-16 relative">
            <h1 className="text-2xl font-bold mb-4">Quản lý chính sách</h1>

            <div className="flex justify-between items-center mb-4">
                {/* Tab navigation */}
                <div className="flex border-b">
                    {['SHOP', 'CATEGORY'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setPageInfo((prev) => ({ ...prev, number: 0 }));
                            }}
                            className={`px-6 py-2 text-sm font-semibold ${
                                activeTab === tab
                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                    : 'text-gray-600 hover:text-blue-500'
                            }`}
                        >
                            {tab === 'SHOP' ? 'Shop' : 'Danh mục'}
                        </button>
                    ))}
                </div>

            </div>


            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
                </div>
            ) : (
                <div className="p-4">{renderTabContent()}</div>
            )}
        </div>
    );
};

export default SaleOffManagement;
