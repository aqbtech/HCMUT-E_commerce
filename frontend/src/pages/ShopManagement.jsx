import { useState, useEffect, useContext } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import ProductManagement from "../components/shopPage/ProductManagement";
import OrderManagement from "../components/shopPage/OrderManagement";
import ShopInfo from "../components/shopPage/ShopInfo";
import { ShopContext } from "../context/ShopContext";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { checkStatus } from "../fetchAPI/fetchAccount";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ShopManagement = () => {
    const { navigate } = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation(); // Để lấy đường dẫn hiện tại
    const initialTab = searchParams.get("tab") || "product";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [status, setStatus] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tab = searchParams.get("tab") || "product";
        setActiveTab(tab);

        // Kiểm tra cookie
        if (!Cookies.get("username")) {
            const currentTab = location.search;
            navigate("/Login", { state: { from: location.pathname + currentTab } });
        }
    }, [searchParams, location]);

    //Kiem tra xem nguoi ban da dc duyet chưa?
    useEffect(() => {
        const fetchStatus = async () => {
            setLoading(true);
            try {
                const response = await checkStatus();
                if (response) setStatus(true);
            } catch (err) {
                toast.error("Lỗi khi kiểm tra trạng thái người bán!");
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setSearchParams({ tab: newTab });
    };

    return !loading ? (
        status ? (
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="w-1/4 text-black p-4">
                    <h2 className="text-xl font-bold mb-6">Shop Management</h2>
                    <ul>
                        <li
                            onClick={() => handleTabChange("product")}
                            className={`cursor-pointer py-2 ${
                                activeTab === "product"
                                    ? "text-orange-400 font-bold"
                                    : "hover:text-gray-300"
                            }`}
                        >
                            Quản Lý Sản Phẩm
                        </li>
                        <li
                            onClick={() => handleTabChange("order")}
                            className={`cursor-pointer py-2 ${
                                activeTab === "order"
                                    ? "text-orange-400 font-bold"
                                    : "hover:text-gray-300"
                            }`}
                        >
                            Quản Lý Đơn Hàng
                        </li>
                        <li
                            onClick={() => handleTabChange("shop")}
                            className={`cursor-pointer py-2 ${
                                activeTab === "shop"
                                    ? "text-orange-400 font-bold"
                                    : "hover:text-gray-300"
                            }`}
                        >
                            Thông Tin Cửa Hàng
                        </li>
                    </ul>
                </div>

                {/* Content */}
                <div className="w-3/4 p-6 bg-white">
                    {activeTab === "product" && <ProductManagement />}
                    {activeTab === "order" && <OrderManagement />}
                    {activeTab === "shop" && <ShopInfo />}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center  mt-48 min-h-screen text-center">
                <h1 className="text-4xl font-bold text-red-500">Đang Xử Lý</h1>
                <p className="text-gray-600 mt-4">
                    Đơn đăng ký của bạn đang chờ để được xử lý. Vui lòng quay lại sau khi
                    admin đã duyệt tài khoản của bạn.
                </p>
                <Link
                    to="/"
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Về Trang Chủ
                </Link>
            </div>
        )
    ) : (
        <div className="flex justify-center mt-32 h-screen">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
        </div>
    );
};

export default ShopManagement;