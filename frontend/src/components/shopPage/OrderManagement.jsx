import {useContext, useEffect, useState } from 'react';
import {
    approveOrderForSeller,
    cancelOrderForSeller,
    getListApprovedOrders, getListCancelledOrders, getListCompletedOrders, getListShippingOrders,
    getListWaitingOrders,
} from "../../fetchAPI/fetchOrders.jsx";
import {ShopContext} from "../../context/ShopContext.jsx";
import Cookies from "js-cookie";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import {toast} from "react-toastify";
import Title from "../Title.jsx";
// Hàm để định dạng tiền tệ



const OrderManagement = () => {
    const [sellerOrders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false); // Trạng thái loading khi gọi API
    const [hasMore, setHasMore] = useState(false); // Kiểm tra nếu có thêm dữ liệu hay không
    const [filterState, setFilterState] = useState("WAITING");
    const {
        formatCurrency,
        navigate,
        curState
    } = useContext(ShopContext);
    const username = Cookies.get('username');
    const [currentPage, setCurrentPage] = useState(0)
    const limit = 10;

    const getOrdersByState = async (state) => {
        if (loading) return;
        setLoading(true);
        try {
            let res;
            switch (state) {
                case "WAITING":
                    res = await getListWaitingOrders(username, currentPage, limit);
                    break;
                case "APPROVED":
                    res = await getListApprovedOrders(username, currentPage, limit);
                    break;
                case "SHIPPING":
                    res = await getListShippingOrders(username, currentPage, limit);
                    break;
                case "COMPLETED":
                    res = await getListCompletedOrders(username, currentPage, limit);
                    break;
                case "CANCELLED":
                    res = await getListCancelledOrders(username, currentPage, limit);
                    break;
                default:
                    return;
            }
            if (currentPage === 0) {
                setOrders(res.content);
            } else {
                setOrders((prevData) => {
                    const newData = res.content.filter(
                        (newItem) =>
                            !prevData.some((prevItem) => prevItem.orderId === newItem.orderId)
                    );
                    return [...prevData, ...newData];
                });
            }
            setHasMore(res.page.totalElements > sellerOrders.length + res.content.length);
        } catch (err) {
            console.error("Lỗi khi lấy đơn hàng: ", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadmore = () => {
        if (hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    // Gọi hàm getOrders khi component load
    useEffect(() => {
        if (!Cookies.get("username")) {
            console.log(curState);
            navigate(`/Login`);
            return;
        }
        getOrdersByState(filterState);
    }, [currentPage, filterState]);

    useEffect(() => {
        setOrders([]);
        setCurrentPage(0);
    }, [filterState]);
    const handleApproveOrder = async (orderId) => {
        const body = { orderId: orderId };
        try {
            await approveOrderForSeller(body);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderId === orderId
                        ? { ...order, deliveryState: "APPROVED" }
                        : order
                )
            );
            toast.success("Đã duyệt đơn hàng thành công!");
        } catch (error) {
            console.error("Lỗi khi duyệt đơn hàng:", error);
            toast.error("Lỗi khi duyệt đơn hàng, vui lòng thử lại.");
        }
    };

    const handleCancelOrder = async (orderId) => {
        const body = { orderId: orderId};
        try {
            await cancelOrderForSeller(body);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderId === orderId
                        ? { ...order, deliveryState: "CANCELLED" }
                        : order
                )
            );
            toast.success("Đã hủy đơn hàng thành công!");
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            toast.error("Lỗi khi hủy đơn hàng, vui lòng thử lại.");
        }
    };

    // Tính tổng số lượng sản phẩm
    const totalQuantity = (order) => {
        return order.listProduct.reduce((total, product) => total + product.quantity, 0);
    };

    // Tính tổng số tiền
    const totalAmount = (order) => {
        return order.listProduct.reduce((total, product) => total + (product.price * product.quantity), 0);
    };

    return loading ? (
        <div className="flex justify-center items-center py-[500px]">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
        </div>
    ) :(
        <div className="">
            <h2 className="text-2xl font-bold mb-4">
                <Title text1="Quản Lý" text2="Đơn Hàng"/>
            </h2>
            <div className="flex border-b mb-4 justify-center items-center">
                {['WAITING', 'APPROVED', 'SHIPPING', 'COMPLETED', 'CANCELLED'].map((state, index) => (
                    <button key={index} onClick={() => setFilterState(state)}
                            className={`px-6 py-2 text-sm font-semibold ${
                                filterState === state
                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                    : 'text-gray-600 hover:text-blue-500'
                            }`}
                    >
                        {state === 'WAITING' && 'Chờ duyệt'}
                        {state === 'APPROVED' && 'Đã duyệt'}
                        {state === 'SHIPPING' && 'Đang giao'}
                        {state === 'COMPLETED' && 'Đã giao'}
                        {state === 'CANCELLED' && 'Đã hủy'}
                    </button>
                ))}
            </div>


            {/* Kiểm tra nếu không có đơn hàng nào */}
            {sellerOrders.length === 0 ? (
                <p className="text-center text-gray-600 mt-8">Bạn chưa có đơn hàng nào.</p>
            ) : (
                sellerOrders
                    .filter((order) => order.deliveryState === filterState)
                    .map((order, orderIndex) => (
                        <div
                            key={orderIndex}
                            className="p-4 mb-6 bg-white rounded-lg shadow-md text-gray-800"
                        >
                            <div className="text-lg font-semibold mb-2">
                                Đơn hàng từ:{" "}
                                <span className="text-blue-600">{order.sellerName}</span>
                            </div>

                            {/* Trạng thái giao hàng và các nút hủy/xác nhận đơn */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            order.deliveryState === "WAITING"
                                                ? "bg-gray-100 text-gray-600" // Chờ duyệt
                                                : order.deliveryState === "APPROVED"
                                                    ? "bg-blue-100 text-blue-600" // Đã duyệt
                                                    : order.deliveryState === "SHIPPING"
                                                        ? "bg-yellow-100 text-yellow-600" // Đang giao
                                                        : order.deliveryState === "COMPLETED"
                                                            ? "bg-green-100 text-green-600" // Đã giao
                                                            : order.deliveryState === "CANCELLED"
                                                                ? "bg-red-100 text-red-600" // Đã hủy
                                                                : ""
                                        }`}
                                    >
                                      {order.deliveryState === "WAITING"
                                          ? "Chờ duyệt"
                                          : order.deliveryState === "APPROVED"
                                              ? "Đã duyệt"
                                              : order.deliveryState === "SHIPPING"
                                                  ? "Đang giao"
                                                  : order.deliveryState === "COMPLETED"
                                                      ? "Đã giao"
                                                      : order.deliveryState === "CANCELLED"
                                                          ? "Đã hủy"
                                                          : ""}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                                   ${order.status === "2"
                                    ?  "bg-red-100 text-red-600"
                                    :  order.status === "1"
                                      ? "bg-green-100 text-green-600" 
                                      : order.status === "3"
                                          ? "bg-yellow-100 text-yellow-600"
                                          : ""
                                }
                                }`}
                                >
                                  {order.status === "2"
                                      ? "Chưa thanh toán"
                                      : order.status === "1"
                                        ? "Đã thanh toán"
                                        : order.status === "3"
                                          ?  "Đang xử lý"
                                          : ""
                                  }
                                  </span>
                                </div>

                                {/* Nút hủy và xác nhận */}
                                <div>
                                    <button
                                        onClick={() => handleCancelOrder(order.orderId)}
                                        disabled={order.deliveryState !== "WAITING" || !order.isCOD}
                                        className="px-4 py-2 rounded-full border text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Hủy đơn hàng
                                    </button>
                                    <button
                                        onClick={() => handleApproveOrder(order.orderId)}
                                        disabled={order.deliveryState !== "WAITING"}
                                        className="ml-2 px-4 py-2 rounded-full border text-sm font-medium bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Xác nhận đơn hàng
                                    </button>
                                </div>
                            </div>

                            {order.listProduct.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col md:flex-row md:items-center gap-4 py-2"
                                >
                                    {/* Thông tin sản phẩm */}
                                    <div className="flex items-start gap-6 text-sm">
                                        <img
                                            className="w-16 sm:w-20 object-cover rounded-lg border"
                                            src={product.img}
                                            alt={product.productName}
                                        />
                                        <div>
                                            <p className="sm:text-base font-medium text-gray-900">
                                                {product.productName || "Sản phẩm không xác định"}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-base">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {formatCurrency(product.price)}
                                                </p>
                                                <p className="text-gray-600">x {product.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Địa chỉ giao hàng */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                {/* Địa chỉ giao hàng */}
                                <div className="flex-[7] p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-lg mb-2">
                                        Địa chỉ giao hàng
                                    </h3>
                                    <p>
                                        <strong>Người nhận:</strong> {order.deliveryAddress.name}
                                    </p>
                                    <p>
                                        <strong>Số điện thoại:</strong>{" "}
                                        {order.deliveryAddress.phone}
                                    </p>
                                    <p>
                                        <strong>Địa chỉ:</strong> {order.deliveryAddress.detail},{" "}
                                        {order.deliveryAddress.ward},
                                        {order.deliveryAddress.district},{" "}
                                        {order.deliveryAddress.province}
                                    </p>
                                </div>

                                {/* Tổng tiền và tổng số lượng */}
                                <div className="flex-[4] p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-lg mb-2">
                                        Thông tin đơn hàng
                                    </h3>
                                    <p>
                                        <strong>Tổng tiền:</strong>{" "}
                                        {formatCurrency(totalAmount(order))}
                                    </p>
                                    <p>
                                        <strong>Tổng số lượng:</strong> {totalQuantity(order)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
            )}

            {/* Nút Xem thêm */}
            {hasMore && !loading && (
                <div className="text-center mt-6">
                    <button
                        onClick={handleLoadmore}
                        className="px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Xem thêm
                    </button>
                </div>
            )}
            {loading && (
                <div className="text-center mt-6">
                    <p>Đang tải...</p>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;