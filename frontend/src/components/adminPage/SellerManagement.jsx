import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  approveSeller,
  deleteSeller,
  getCandidateSeller,
} from "../../fetchAPI/fetchAccount";
import Title from "../Title";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SellerManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Hàm fetch dữ liệu người bán
  const fetchUsers = async (currentPage = 0) => {
    setLoading(true);
    try {
      const response = await getCandidateSeller(currentPage);
      setUsers(response.content);
      setPage(currentPage);
      setTotalPages(response.page.totalPages);
      setHasMore(currentPage + 1 < response.page.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchUsers khi component mount hoặc page thay đổi
  useEffect(() => {
    fetchUsers(page);
  }, []);

  // Xử lý duyệt người bán
  const handleApprove = async (id) => {
    try {
      await approveSeller(id);
      toast.success("Duyệt người bán thành công!");
      fetchUsers(page); // Cập nhật lại danh sách
    } catch (err) {
      toast.error("Lỗi khi duyệt người bán!");
      console.error("Lỗi khi duyệt:", err);
    }
  };

  // Xử lý xóa người bán
  const handleDelete = async (id) => {
    try {
      await deleteSeller(id);
      toast.success("Xóa người bán thành công!");
      fetchUsers(page); // Cập nhật lại danh sách
    } catch (err) {
      toast.error("Lỗi khi xóa người bán!");
      console.error("Lỗi khi xóa:", err);
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchUsers(newPage);
    }
  };

 
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        <Title text1="Quản Lý" text2="Người Bán" />
      </h2>

      {/* Hiển thị trạng thái loading */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
        </div>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 border-b text-left">STT</th>
              <th className="p-2 border-b text-left">Tên cửa hàng</th>
              <th className="p-2 border-b text-left">Tên người bán</th>
              <th className="p-2 border-b text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="p-2 border-b">{index + 1 + page * 10}</td>
                  <td className="p-2 border-b">{user.shopName}</td>
                  <td className="p-2 border-b">{user.sellerName}</td>
                  <td className="p-2 border-b">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                      onClick={() => handleApprove(user.sellerName)}
                    >
                      Duyệt
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                      onClick={() => handleDelete(user.sellerName)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Không có người bán nào cần duyệt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Phân trang */}
      {(
        <div className="flex justify-center items-center mt-4">
          <button
            className={`px-4 py-2 rounded mx-2 ${
              page === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-700"
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
                : "bg-blue-500 text-white hover:bg-blue-700"
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

export default SellerManagement;