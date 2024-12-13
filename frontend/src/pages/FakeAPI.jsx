import { useState } from "react";
import { axiosClient2 } from "../fetchAPI/axios";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const FakeAPI = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Order đang được chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái của modal
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(""); // Username để fetch
  const [inputUsername, setInputUsername] = useState(""); // Lưu input của người dùng

  // Hàm fetch API
  const fetchOrders = async (user) => {
    setLoading(true);
    try {
      const response = await axiosClient2.get(`/api/admin/order?page=${page}&username=${user}`);
      setTotalPages(response.page?.totalPages || 1);
      setHasMore(page + 1 < response.page?.totalPages);
      setOrders(response.data.result.content);
      console.log("Lấy đơn hàng thành công", response.data.result);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Lỗi khi lấy đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchOrders khi nhấn "Lấy Đơn Hàng"
  const handleFetchOrders = () => {
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
      setPage(0); // Reset về trang đầu
      fetchOrders(inputUsername.trim());
    } else {
      toast.error("Vui lòng nhập username!");
    }
  };

  // Hàm mở modal
  const openModal = (order) => {
    setSelectedOrder({ ...order }); // Copy order được chọn để chỉnh sửa
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // Hàm lưu dữ liệu sau khi chỉnh sửa
  const saveChanges = async () => {
    try {
      const body = {
        orderId: selectedOrder.orderId,
        status: selectedOrder.deliveryState,
        deliveryDate: selectedOrder.deliveryDate,
        expectedDeliveryDate: selectedOrder.expectedDeliveryDate,
      };

      await axiosClient2.post(`/api/admin/order`, body);
      toast.success("Cập nhật đơn hàng thành công!");
      fetchOrders(username);
      closeModal();
    } catch (err) {
      toast.error("Lỗi khi cập nhật đơn hàng!");
      console.error("Lỗi khi fake API:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      fetchOrders(username);
    }
  };

  return (
    <div className="min-h-screen border-t">
      <div className="flex flex-col items-center m-auto mt-10">
        <p className="prata-regular text-3xl mb-4">Trạng Thái Đơn Hàng</p>
        {/* Ô nhập username */}
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Nhập username để lấy đơn hàng"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="border p-2 rounded-l w-64"
          />
          <button
            onClick={handleFetchOrders}
            className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
          >
            Lấy Đơn Hàng
          </button>
        </div>
        {loading ? (
           <div className="flex justify-center mt-32 h-screen">
           <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
         </div>
        ) : orders.length > 0 ? (
          <div className="w-full max-w-4xl">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="flex justify-between items-center p-4 border-b"
              >
                <div>
                  <p>Order ID: {order.orderId}</p>
                  <p>Trạng Thái: {order.deliveryState}</p>
                  <p>Ngày Giao Thực Tế: {order.deliveryDate}</p>
                  <p>Ngày Giao Dự Kiến: {order.expectedDeliveryDate}</p>
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => openModal(order)}
                >
                  Sửa
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-50 mt-10 w-max">
            <h2 className="text-xl font-bold">Chưa có đơn hàng nào!</h2>
            <p>Hiện tại chưa có đơn hàng nào để admin quản lý :)))</p>
          </div>
        )}
      </div>

      {/* Modal chỉnh sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Chỉnh Sửa Đơn Hàng</h2>
            <div className="mb-4">
              <label className="block mb-2">Trạng Thái:</label>
              <select
                  value={selectedOrder.deliveryState}
                  defaultValue={"CANCELLED"}
                  onChange={(e) =>
                      setSelectedOrder({...selectedOrder, deliveryState: e.target.value})
                  }
                  className="w-full border p-2 rounded"
              >
                <option value="">{selectedOrder.deliveryState || 'Chọn trạng thái đơn hàng'}</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="DELIVERED">WAITING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="SHIPPING">SHIPPING</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Ngày Giao Thực Tế:</label>
              <input
                type="date"
                value={selectedOrder.deliveryDate}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, deliveryDate: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Ngày Giao Dự Kiến:</label>
              <input
                type="date"
                value={selectedOrder.expectedDeliveryDate}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, expectedDeliveryDate: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={closeModal}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={saveChanges}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phân trang */}
      {hasMore && (
        <div className="flex justify-center items-center mt-4">
          <button
            className={`px-4 py-2 rounded mx-2 ${
              page === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
          >
            Trang trước
          </button>
          <span className="mx-2">
            Trang {page + 1} / {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded mx-2 ${
              page + 1 >= totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => handlePageChange(page + 1)}
            disabled={page + 1 >= totalPages}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default FakeAPI;
