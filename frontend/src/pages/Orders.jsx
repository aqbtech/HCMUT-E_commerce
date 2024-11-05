import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { getListOrders, updateSateOfOrder } from '../fetchAPI/fetchOrders';
import { toast } from 'react-toastify';

const Orders = () => {
  const { account } = useContext(ShopContext);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await getListOrders(account);
        setUserOrders(response || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    
    getOrders();
  }, []);

  const handleCancelOrder = async (itemId) => {
    const body = {"state" : "Hủy đơn"}
    try {
      await updateSateOfOrder( itemId, body);
      setUserOrders(prevOrders => 
        prevOrders.map(item =>
          item.productId === itemId ? { ...item, deliveryState: "Hủy Đơn" } : item
        )
      );
      toast.success("Đã hủy đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error("Lỗi khi hủy đơn hàng, vui lòng thử lại.");
    }
  };

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {userOrders.map((order, index) => (
          <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            {/* Thông tin sản phẩm */}
            <div className='flex items-start gap-6 text-sm'>
              <img className='w-16 sm:w-20' src={order.IMG} alt={order.productName} />
              <div>
                <p className='sm:text-base font-medium'>{order.productName || "Sản phẩm không xác định"}</p>
                <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                  <p className='text-lg'>{order.price} VND</p>
                  <p>Số lượng: {order.quantity}</p>
                </div>
                {/* Hiển thị các thuộc tính sản phẩm */}
                <p className='mt-2'>Thuộc tính:</p>
                <ul>
                  {order.ListAtt.map((att, idx) => (
                    <li key={idx}>{att.name}: {att.value}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Địa chỉ giao hàng */}
            <div className='text-sm mt-2 md:mt-0'>
              <p><strong>Người nhận:</strong> {order.deliveryAddress.name}</p>
              <p><strong>Số điện thoại:</strong> {order.deliveryAddress.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.deliveryAddress.Detail}, {order.deliveryAddress.state}, {order.deliveryAddress.province}</p>
            </div>

            {/* Trạng thái và Hủy đơn */}
            <div className='md:w-1/2 flex justify-between'>
              <div className='flex items-center gap-2'>
                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                <p className='text-sm md:text-base'>{order.deliveryState}</p>
              </div>
              <button 
                onClick={() => handleCancelOrder(order.productId)}
                className='border px-4 py-2 text-sm font-medium hover:text-white hover:bg-black'
              >
                Hủy đơn hàng
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
