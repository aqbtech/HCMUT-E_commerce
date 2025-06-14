import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { cancelOrder, getListOrders } from "../fetchAPI/fetchOrders";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from "react-router-dom";

const Orders = () => {
  const { totalQuantity, formatCurrency } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [sortKey, setSortKey] = useState(""); // placeOrderDate | expectedDeliveryDate | deliveryDate
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc
  const username = Cookies.get("username");

  const getOrders = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getListOrders(username, currentPage, 10);
      if (currentPage === 0) {
        setUserOrders(res.content);
      } else {
        setUserOrders((prevData) => {
          const newData = res.content.filter(
            (newItem) => !prevData.some((prevItem) => prevItem.orderId === newItem.orderId)
          );
          return [...prevData, ...newData];
        });
      }
      setHasMore(currentPage + 1 < res.page.totalPages);
    } catch (err) {
      toast.error("Có lỗi khi lấy đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [currentPage]);

  const handleCancelOrder = async (orderId) => {
    const body = { orderId };
    try {
      await cancelOrder(body);
      setUserOrders((prevOrders) =>
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

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // frontend sort
  const sortedOrders = [...userOrders].sort((a, b) => {
    if (!sortKey) return 0;
    const dateA = new Date(a[sortKey]);
    const dateB = new Date(b[sortKey]);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return loading ? (
    <div className="flex justify-center items-center py-[500px]">
      <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
    </div>
  ) : (
    <div className="border-t pt-16 min-h-screen">
      <div className="text-2xl">
        <Title text1={"ĐƠN"} text2={"HÀNG"} />
      </div>

      {/* sort UI */}
      <div className="flex flex-wrap items-center gap-4 mt-4 mb-6 px-4">
        <label className="font-medium">Sắp xếp theo:</label>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Không sắp xếp --</option>
          <option value="placeOrderDate">Ngày đặt hàng</option>
          <option value="expectedDeliveryDate">Ngày nhận dự kiến</option>
          <option value="deliveryDate">Ngày nhận thực tế</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
      </div>

      <div>
        {sortedOrders?.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            Bạn chưa có đơn hàng nào.
          </p>
        ) : (
          sortedOrders.map((order, orderIndex) => (
            <div
              key={orderIndex}
              className="p-4 mb-6 bg-white rounded-lg shadow-md text-gray-800"
            >
              <div className="text-lg font-semibold mb-2">
                Đơn hàng từ:{" "}
                <Link to={``}>
                  <span className="text-blue-600">{order.sellerName}</span>
                </Link>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.deliveryState === "WAITING"
                        ? "bg-gray-100 text-gray-600"
                        : order.deliveryState === "APPROVED"
                        ? "bg-blue-100 text-blue-600"
                        : order.deliveryState === "SHIPPING"
                        ? "bg-yellow-100 text-yellow-600"
                        : order.deliveryState === "COMPLETED"
                        ? "bg-green-100 text-green-600"
                        : order.deliveryState === "CANCELLED"
                        ? "bg-red-100 text-red-600"
                        : ""
                    }`}
                  >
                    {{
                      WAITING: "Chờ duyệt",
                      APPROVED: "Đã duyệt",
                      SHIPPING: "Đang giao",
                      COMPLETED: "Đã giao",
                      CANCELLED: "Đã hủy",
                    }[order.deliveryState]}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "2"
                        ? "bg-red-100 text-red-600"
                        : order.status === "1"
                        ? "bg-green-100 text-green-600"
                        : order.status === "3"
                        ? "bg-yellow-100 text-yellow-600"
                        : ""
                    }`}
                  >
                    {{
                      1: "Đã thanh toán",
                      2: "Chưa thanh toán",
                      3: "Đang xử lý",
                    }[order.status]}
                  </span>
                </div>

                <button
                  onClick={() => handleCancelOrder(order.orderId)}
                  disabled={
                    order.deliveryState !== "WAITING" || order.status === "1"
                  }
                  className="px-4 py-2 rounded-full border text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                >
                  Hủy đơn hàng
                </button>
              </div>

              {order.listProduct.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center gap-4 py-2"
                >
                  <div className="flex items-start gap-6 text-sm">
                    <img
                      className="w-16 sm:w-20 object-cover rounded-lg border"
                      src={product.img}
                      alt={product.productName}
                    />
                    <div>
                      <Link to={`/product/${product.id}`}>
                        <p className="sm:text-base font-medium text-gray-900 hover:text-blue-200">
                          {product.productName || "Sản phẩm không xác định"}
                        </p>
                      </Link>

                      <div className="flex items-center gap-3 mt-2 text-base">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-gray-600">Số lượng: {product.quantity}</p>
                      </div>

                      <ul className="pl-4 list-disc text-gray-600">
                        {product.listAtt?.map(
                          (att, idx) =>
                            att.name && (
                              <li key={idx}>
                                {att.name}: {att.value}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-[5] p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2">Địa chỉ giao hàng</h3>
                  <p><strong>Người nhận:</strong> {order.deliveryAddress.name}</p>
                  <p><strong>Số điện thoại:</strong> {order.deliveryAddress.phone}</p>
                  <p>
                    <strong>Địa chỉ:</strong> {order.deliveryAddress.detail}, {order.deliveryAddress.ward}, {order.deliveryAddress.district}, {order.deliveryAddress.province}
                  </p>
                </div>

                <div className="flex-[2] p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2">Trạng thái đơn hàng</h3>
                  <p><strong>Ngày đặt:</strong> {order.placeOrderDate}</p>
                  <p><strong>Ngày nhận dự kiến:</strong> {order.expectedDeliveryDate}</p>
                  <p><strong>Ngày nhận thực tế:</strong> {order.deliveryDate}</p>
                </div>

                <div className="flex-[2] p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2">Thông tin đơn hàng</h3>
                  <p><strong>Phương thức thanh toán:</strong> {order.isCOD ? "COD (Thanh toán khi nhận hàng)" : "Thanh toán điện tử"}</p>
                  <p><strong>Tiền ship:</strong> {formatCurrency(Number(order.shipping_fee))}</p>
                  <p><strong>Tổng tiền:</strong> {formatCurrency(Number(order.price))}</p>
                  <p><strong>Tổng số lượng:</strong> {totalQuantity(order)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {userOrders?.length > 0 && hasMore && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleLoadMore}
            disabled={!hasMore}
            className="border px-4 py-2 font-medium hover:bg-gray-300 disabled:opacity-50"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
