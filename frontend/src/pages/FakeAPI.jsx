import { useEffect, useState } from "react";
import { axiosClient2 } from "../fetchAPI/axios";
import { toast } from "react-toastify";

const FakeAPI = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Order đang được chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái của modal
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Hàm fetch API
  const fetchOrders = async () => {
    try {
      const response = await axiosClient2.get(``); 
      setTotalPages(response.page?.totalPages || 1);
      setHasMore(page + 1  < response.page?.totalPages)
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Lỗi khi lấy đơn hàng")
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchOrders();
  }, []);

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
  const saveChanges = async (body) => {
    try {
      const body = {
        orderId: selectedOrder.orderId,
        state: selectedOrder.state,
        deliveryDate: selectedOrder.deliveryDate,
        expectDate: selectedOrder.expectDate,
      };

      const response = await axiosClient2.post(``, body)
      toast.success("Cập nhật API đơn hàng thành công!")
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === selectedOrder.orderId ? { ...order, ...body } : order
        )
      );
      closeModal();
    } catch (err) {
      toast.error("Lỗi khi cập nhật đơn hàng!")
      console.error("Lỗi khi fake API:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
      fetchOrders(newPage);
    }
  };


  return (
    <div className="min-h-screen border-t">
      <div className="flex flex-col items-center m-auto mt-10">
        <p className="prata-regular text-3xl">Trạng Thái Đơn Hàng</p>
        {
          orders.length > 0 ?  (<div className="w-full max-w-4xl">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="flex justify-between items-center p-4 border-b"
              >
                <div>
                  <p>Order ID: {order.orderId}</p>
                  <p>Trạng Thái: {order.state}</p>
                  <p>Ngày Giao Thực Tế: {order.deliveryDate}</p>
                  <p>Ngày Giao Dự Kiến: {order.expectDate}</p>
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
          ) 
          : 
          (<div className="text-center p-6 bg-gray-50 mt-10 w-max">
            <h2 className="text-xl font-bold">Chưa có đơn hàng nào!</h2>
            <p>
              hiện tại chưa có đơn hàng nào để admin quản lý :)))
            </p>
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
                value={selectedOrder.state}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, state: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="CANCELLED">CANCELLED</option>
                <option value="PENDING">PENDING</option>
                <option value="DELIVERED">DELIVERED</option>
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
                value={selectedOrder.expectDate}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, expectDate: e.target.value })
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
      {hasMore && ( <div className="flex justify-center items-center mt-4">
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
