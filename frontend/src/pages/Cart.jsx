import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { getMyCart, fetchCart } from '../fetchAPI/fetchCart';
import ErrorMessage from '/src/components/errorMessage';

const Cart = () => {
  const { updateQuantity, navigate, setListProductToPlace, systemError, setSystemError } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState( 0);
  const [currentPage, setCurrentPage] = useState(1);

  const getCart = () => {
    fetchCart(currentPage)
    .then((res) => {
      setCartData(res);
      console.log(cartData);
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
      setSystemError(err.response?.data?.message || err.response?.data?.error || "Mất kết nối máy chủ");
    });
  };

  useEffect(() => {
    getCart();
  }, [currentPage]); 

  useEffect(() => {
    const newTotal = selectedItems.reduce((acc, id) => {
      console.log(selectedItems, total);
      const item = cartData.find(item => item.instantId === id);
      return item ? acc + item.price * item.quantity : acc;
    }, 0);
    setTotal(newTotal);
  }, [selectedItems, cartData]);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity > 0) {
      updateQuantity(itemId, quantity);
      getCart(); 
    }
  };


  const handleRemoveItem = (itemId) => {
    updateQuantity(itemId, 0);
    setCartData(prevCartData => prevCartData.filter(item => item.instantId !== itemId));
    setSelectedItems(prevSelectedItems => prevSelectedItems.filter(id => id !== itemId));
    toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
    getCart(); // Cập nhật giỏ hàng sau khi xóa sản phẩm
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prevSelectedItems => {
      const updatedItems = prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter(id => id !== itemId)
        : [...prevSelectedItems, itemId];
      
      // Cập nhật lại tổng ngay khi thay đổi selectedItems
      const newTotal = updatedItems.reduce((acc, id) => {
        const item = cartData.find(item => item.instantId === id);
        return item ? acc + Number(item.price) * item.quantity : acc;
      }, 0);
      setTotal(newTotal);
      
      return updatedItems;
    });
  };

  const handleProceed = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một mặt hàng để đặt hàng!");
    } else {
      const listProductToPlace = selectedItems.map(itemId => {
        const item = cartData.find(cartItem => cartItem.instantId === itemId);
        return {
          "productName": item.productName,
          "productId": item.productId,
          "listAtt": item.ListAtt,
          "instantId": item.instantId,
          "quantity": item.quantity,
          "price": item.price,
        };
      });
  
      setListProductToPlace(listProductToPlace);
      navigate('/place-Order');
    }
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prevPage => prevPage - 1);
  };

  if (systemError) {
    return <ErrorMessage message={systemError} />;
  }
  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1='YOUR' text2='CART' />
      </div>

      <div>
        {cartData?.length > 0 ? (
          cartData.map((item, index) => (
            <div
              key={index}
              className='py-4 border-t border-b text-gray-700 grid grid-cols-[0.5fr_4fr_0.5fr_0.5fr] sm:grid-cols-[1fr_4fr_2fr_1fr] items-center gap-4'
            >
              <input
                type='checkbox'
                checked={selectedItems.includes(item.instantId)}
                onChange={() => handleSelectItem(item.instantId)}
              />

              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={item.IMG} alt={item.productName} />
                <div>
                  <p className='text-xl sm:text-l  font-medium'>{item.productName}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{item.price}.000 VNĐ</p>
                    <ul>
                      {item.ListAtt.map((att, idx) => (
                        <li key={idx} className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>
                          {att.name}: {att.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <input
                type='number'
                min={1}
                value={item.quantity}
                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                onChange={(e) => handleQuantityChange(item.instantId, Number(e.target.value))}
              />

              <img
                src={assets.bin_icon}
                alt='Remove item'
                className='w-4 mr-4 sm:w-5 cursor-pointer'
                onClick={() => handleRemoveItem(item.instantId)}
              />
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500'>Giỏ hàng của bạn hiện đang trống.</p>
        )}
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

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
            <div className='w-full'>
              <div className='text-2xl'>
                  <Title text1={'CART'} text2={'TOTAL'}/>
              </div>
            
              <div className='flex flex-col gap-2 mt-2 text-sm'>
                  <div className='flex justify-between'>
                      <p>Tổng hàng</p>
                      <p>{total + '.000'} VNĐ</p>
                  </div>
              </div>
              <hr />
              <div className='flex justify-between'>
                  <p>Phí ship</p>
                  <p>10.000 VNĐ</p>
              </div>
              <hr />
              <div className='flex justify-between'>
                  <b>Tổng cộng</b>
                  {/* <b>{currency} {getCartAmount() === 0 ? 0 : String(getCartAmount() + delivery_fee) + '.00'}</b> */}
                  <b>{total + 10 + '.000'} VNĐ  </b>
              </div>
            </div>
          
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
