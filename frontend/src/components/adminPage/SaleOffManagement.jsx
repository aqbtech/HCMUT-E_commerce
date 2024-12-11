import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { getShopPolicy, getCategoryPolicy, createPolicy, updatePolicy, deletePolicy } from '../../fetchAPI/fetchPolicy.jsx';
import { getAllCategory } from '../../fetchAPI/fetchCategory.jsx';
import Title from '../Title.jsx';

const SaleOffManagement = () => {
    const [activeTab, setActiveTab] = useState('SHOP');
    const [loading, setLoading] = useState(false);
    const [policies, setPolicies] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPolicy, setCurrentPolicy] = useState(null);

    const handleOpenModal = (type, policy = null) => {
        setCurrentPolicy(policy);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPolicy(null);
    };

    const handleSubmitPolicy = async (data) => {
        try {
            console.log(data);
            if (data.policyId) {
                await handleUpdateSaleOff(data);
            } else {
                await handleCreateSaleOff(data);
            }
            loadPolicies();
            handleCloseModal();
        } catch (err) {
            console.error(err);
        }
    };

    const loadPolicies = async () => {
        setLoading(true);
        try {
            const res = activeTab === 'SHOP' ? await getShopPolicy(page) : await getCategoryPolicy(page);
            setPolicies(res.content || []);
            setHasMore(page + 1 < res.page.totalPages);
        } catch (err) {
            toast.error(`Lỗi khi lấy chính sách ${activeTab === 'SHOP' ? 'shop' : 'danh mục'}!`);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllCategory();
            setCategories(response);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
        }
    };

    useEffect(() => {
        if (activeTab !== "SHOP") {
            fetchCategories();
        }
        loadPolicies();
    }, [activeTab, page]);

    const handleCreateSaleOff = async (body) => {
        try {
            console.log(body);
            await createPolicy(body);
            toast.success("Thêm chính sách thành công!");
        } catch (err) {
            console.log("lõi khi thêm chính sách", err)
            toast.error("Lỗi khi thêm chính sách!");
        }
    };

    const handleDeleteSaleOff = async (type, id) => {
        try {
            await deletePolicy(type, id);
            toast.success("Xóa chính sách thành công!");
            loadPolicies();
        } catch (err) {
            console.log("lõi khi xóa chính sách", err)
            toast.error("Lỗi khi xóa chính sách!");
        }
    };

    const handleUpdateSaleOff = async (body) => {
        try {
            await updatePolicy(body);
            toast.success("Cập nhật chính sách thành công!");
        } catch (err) {
            console.log("lõi khi cập nhật chính sách", err)
            toast.error("Lỗi khi cập nhật chính sách!");
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) setPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const renderTabContent = () => {
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Giảm giá {activeTab === 'SHOP' ? 'theo Shop' : 'theo Danh mục'}
                    </h2>
                    <button
                        onClick={() => handleOpenModal(activeTab)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Thêm Chính Sách
                    </button>
                </div>
                {policies.length > 0 ? (
                    <div className="space-y-4">
                        {policies.map((policy, index) => (
                            <div
                                key={index}
                                className="border p-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
                            >
                                <h3 className="font-semibold text-lg">{policy.policy_name}</h3>
                                <p className="text-sm text-gray-600">{policy.policy_description}</p>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <strong>Ngày áp dụng:</strong> {policy.apply_date}
                                    </div>
                                    <div>
                                        <strong>Ngày ban hành:</strong> {policy.apply_date || 'Chưa có'}
                                    </div>
                                    <div>
                                        <strong>Tỷ lệ giảm:</strong> {policy.sale * 100}%
                                    </div>
                                    <div>
                                        <strong>Số lượt sử dụng:</strong> {policy.count}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => handleOpenModal(activeTab, policy)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSaleOff(policy.type, policy.policyId)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Chưa có chính sách giảm giá.</p>
                )}
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 0}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Trang Trước
                    </button>
                    <p>{page + 1}</p>
                    <button
                        onClick={handleNextPage}
                        disabled={!hasMore}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Trang Tiếp
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                <Title text1="Quản Lý" text2="Chính Sách" />
            </h2>
            <div className="flex justify-center items-center mb-4">
                <div className="flex border-b">
                    {['SHOP', 'CATEGORY'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setPage(0);
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
           {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-semibold mb-4">
                            {currentPolicy ? 'Chỉnh sửa Chính Sách' : 'Thêm Chính Sách'}
                        </h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = Object.fromEntries(formData.entries());
                                data.type = activeTab === 'SHOP' ? 'shop' : 'category';
                                data.target =
                                    activeTab === 'SHOP'
                                        ? formData
                                            .get('shop_targets')
                                            .split(',')
                                            .map((shop) => shop.trim())
                                        : Array.from(
                                            e.target.querySelectorAll(
                                                'input[name="category_targets"]:checked'
                                            )
                                        ).map((input) => input.value);
                                data.count = parseInt(data.count, 10) || 0;
                                data.sale = parseFloat(data.sale/100) || 0;
                                data.policyId = currentPolicy?.policyId || null;
                                handleSubmitPolicy(data);
                            }}
                        >
                            {/* Tên chính sách */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Tên Chính Sách
                                </label>
                                <input
                                    name="policy_name"
                                    defaultValue={currentPolicy?.policy_name || ''}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>

                            {/* Mô tả */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <textarea
                                    name="policy_description"
                                    defaultValue={currentPolicy?.policy_description || ''}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>

                            {/* Danh sách mục tiêu */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    {activeTab === 'SHOP'
                                        ? 'Tên Shop (phân cách bằng dấu phẩy)'
                                        : 'Chọn Danh Mục'}
                                </label>
                                {activeTab === 'SHOP' ? (
                                    <input
                                        name="shop_targets"
                                       defaultValue={Array.isArray(currentPolicy?.target) ? currentPolicy.target.join(', ') : ''}
                                        className="w-full border px-3 py-2 rounded"
                                        placeholder="Nhập tên các shop, phân cách bằng dấu phẩy"
                                        required
                                    />
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories.map((category) => (
                                            <label
                                                key={category.id}
                                                className="flex items-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="category_targets"
                                                    value={category.name}
                                                    defaultChecked={currentPolicy?.target?.includes(
                                                        String(category.name)
                                                    )}
                                                    className="mr-2"
                                                />
                                                {category.name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tỷ lệ giảm */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Giá trị</label>
                                <input
                                    name="sale"
                                    type="number"
                                    defaultValue={currentPolicy?.sale * 100 || ''}
                                    className="w-full border px-3 py-2 rounded"
                                    onChange={(e) => {
                                        if(e.target.value <= 1) e.target.value = 1
                                    }}
                                    required
                                />
                            </div>

                            {/* Ngày áp dụng */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Ngày áp dụng</label>
                                <input
                                    name="apply_date"
                                    type="date"
                                    defaultValue={currentPolicy?.apply_date || ''}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>

                            {/* Số lượng được phép sử dụng */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Số lượt
                                </label>
                                <input
                                    min={1}
                                    name="count"
                                    type="number"
                                    defaultValue={currentPolicy?.count || ''}
                                    className="w-full border px-3 py-2 rounded"
                                    onChange={(e) => {
                                        if(e.target.value <= 1) e.target.value = 1
                                    }}
                                    required
                                />
                            </div>

                            {/* Hành động */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default SaleOffManagement;
