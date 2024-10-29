import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Chuyển đổi cartItems thành mảng cartData để hiển thị trong giỏ hàng
useEffect(() => {
  const tempData = [];

  // Kiểm tra nếu cartItems có dữ liệu
  if (cartItems) {
      const items = cartItems.Items; // Lấy danh sách Items từ cartItems
      for (const item of items) { // Duyệt qua từng item
          for (const size of item.sizes) { // Duyệt qua từng kích thước
              const quantity = size.quantity; // Lấy số lượng
              if (quantity > 0) {
                  tempData.push({
                      id: item.id,
                      size: size.size,
                      quantity: quantity
                  });
              }
          }
      }
  }

  setCartData(tempData);
}, [cartItems]);


  // Kiểm tra nếu giỏ hàng trống và điều hướng đến trang thanh toán
  const handleProceed = () => {
    if (cartData.length === 0) {
      toast.error("Giỏ hàng trống kìa!");
    } else {
      navigate('/place-Order');
    }
  };

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1='YOUR' text2='CART' />
      </div>

      <div>
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const productData = products.find((product) => product.id === item.id);
            if (!productData) return null;

            return (
              <div
                key={index}
                className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
              >
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt={productData.name} />
                  <div>
                    <p className='text-xs sm:text-l font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div>
                <input
                  type='number'
                  min={1}
                  defaultValue={item.quantity}
                  className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue > 0) updateQuantity(item.id, item.size, newValue);
                  }}
                />
                <img
                  src={assets.bin_icon}
                  alt='Remove item'
                  className='w-4 mr-4 sm:w-5 cursor-pointer'
                  onClick={() => updateQuantity(item.id, item.size, 0)}
                />
              </div>
            );
          })
        ) : (
          <p className='text-center text-gray-500'>Giỏ hàng của bạn hiện đang trống.</p>
        )}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={handleProceed}
              className='bg-black text-white text-sm my-8 px-8 py-3'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
