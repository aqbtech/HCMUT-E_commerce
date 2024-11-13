import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { getAllOrders, updateSateOfOrder, getListOrders } from '../fetchAPI/fetchOrders';
import { toast } from 'react-toastify';
import ErrorMessage from '/src/components/errorMessage';

const Orders = () => {
  const { systemError, setSystemError } = useContext(ShopContext);
  const [userOrders, setUserOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getOrders = () => {
      getListOrders(currentPage)
        .then((res) => {
          setUserOrders(res); 
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setSystemError(err.response?.data?.message || err.response?.data?.error || "Mất kết nối máy chủ");
        });
    };
    getOrders();
  }, [currentPage]);


  const handleCancelOrder = async (orderId) => {
    const body = { state: "Hủy đơn" };
    try {
      await updateSateOfOrder(orderId, body);
      setUserOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId ? { ...order, deliveryState: "Hủy đơn" } : order
        )
      );
      toast.success("Đã hủy đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error("Lỗi khi hủy đơn hàng, vui lòng thử lại.");
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  if (systemError) {
    return <ErrorMessage message={systemError} />;
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'ĐƠN'} text2={'HÀNG'} />
      </div>

      <div>
          {userOrders?.map((order, orderIndex) => (
            <div key={orderIndex} className="p-4 mb-6 bg-white rounded-lg shadow-md text-gray-800">
              <div className="text-lg font-semibold mb-2">
                Đơn hàng từ: <span className="text-blue-600">{order.sellerName}</span>
              </div>
              
              {/* Trạng thái giao hàng và nút hủy đơn */}
              <div className="flex justify-between items-center mb-4">
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.deliveryState === 'Đang giao' ? 'bg-yellow-100 text-yellow-600' 
                    : order.deliveryState === 'Đã giao' ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                  }`}
                >
                  {order.deliveryState}
                </span>
                <button
                  onClick={() => handleCancelOrder(order.orderId)}
                  disabled={order.deliveryState !== "Đang chờ"}
                  className="px-4 py-2 rounded border text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy đơn hàng
                </button>
              </div>

              {order.listProduct.map((product, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 py-2">
                  {/* Thông tin sản phẩm */}
                  <div className="flex items-start gap-6 text-sm">
                    <img className="w-16 sm:w-20 object-cover rounded-lg border" src={product.IMG} alt={product.productName} />
                    <div>
                      <p className="sm:text-base font-medium text-gray-900">{product.productName || "Sản phẩm không xác định"}</p>
                      <div className="flex items-center gap-3 mt-2 text-base">
                        <p className="text-lg font-semibold text-gray-900">{product.price} VND</p>
                        <p className="text-gray-600">Số lượng: {product.quantity}</p>
                      </div>
                      {/* Hiển thị thuộc tính sản phẩm */}
                      <p className="mt-2 text-gray-500">Thuộc tính:</p>
                      <ul className="pl-4 list-disc text-gray-600">
                        {product.ListAtt.map((att, idx) => (
                          <li key={idx}>{att.name}: {att.value}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              {/* Địa chỉ giao hàng */}
              <div className="text-sm mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p><strong>Người nhận:</strong> {order.deliveryAddress.name}</p>
                <p><strong>Số điện thoại:</strong> {order.deliveryAddress.phone}</p>
                <p><strong>Địa chỉ:</strong> {order.deliveryAddress.Detail}, {order.deliveryAddress.ward}, {order.deliveryAddress.district}, {order.deliveryAddress.province}</p>
              </div>
            </div>
          ))}
        </div>


      <div className='flex justify-center gap-4 mt-8'>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className='border px-4 py-2 font-medium hover:bg-gray-300 disabled:opacity-50'
        >
          Trang trước
        </button>
        <p>{currentPage}</p>
        <button
          onClick={handleNextPage}
          className='border px-4 py-2 font-medium hover:bg-gray-300 disabled:opacity-50'
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default Orders;
