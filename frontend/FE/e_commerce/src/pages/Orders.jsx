import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { fetchOrder } from '../../fetchAPI/fetchOrders'
import { updateState } from '../../fetchAPI/fetchOrders'

const Orders = () => {
  const { products, currency, account } = useContext(ShopContext)
  const [userOrders, setUserOrders] = useState([])

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetchOrder(account.id);
        setUserOrders(response.Items);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getOrders();
  }, [account.id]);

  const handleCancelOrder = async (itemId) => {
    try {
      const updatedItem = await updateState(account.id, itemId, "Hủy Đơn");
      // Cập nhật lại danh sách đơn hàng sau khi cập nhật
      setUserOrders(prevOrders =>
        prevOrders.map(item =>
          item.id === itemId ? { ...item, state: "Hủy Đơn" } : item
        )
      );
    } catch (error) {
      console.error("Error updating order state:", error);
    }
  };

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {userOrders.map((item, itemIndex) =>
          item.sizes.map((sizeInfo, sizeIndex) => (
            <div key={`${itemIndex}-${sizeIndex}`} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={products.find(p => p.id === item.id)?.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{products.find(p => p.id === item.id)?.name || "Unknown Product"}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg'>{currency}{sizeInfo.price}</p>
                    <p>Quantity: {sizeInfo.quantity}</p>
                    <p>Size: {sizeInfo.size}</p>
                  </div>
                  <p className='mt-2'>Date: <span className='text-gray-400'>25, Jul, 2024</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{sizeInfo.state}</p>
                </div>
                <button onClick={() => handleCancelOrder(item.id)} className='border px-4 py-2 text-sm font-medium hover:text-white hover:bg-black'>Hủy đơn hàng</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
