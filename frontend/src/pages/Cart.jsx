import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { updateQuantity, fetchCart, deleteFromCart } from '../fetchAPI/fetchCart';
import ErrorMessage from '/src/components/errorMessage';
import Cookies from 'js-cookie'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { getMininalProfile } from '../fetchAPI/fetchAccount';

const Cart = () => {
  const { systemError, setSystemError, formatCurrency, navigate, setTotalQuantityInCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

   // Lấy dữ liệu giỏ hàng 
   const getCart = async () => {
    if (loading) return; // Nếu đang loading thì không thực hiện nữa
    setLoading(true); // Bắt đầu loading
  
    try {
      const res = await fetchCart(currentPage, 10); // Gọi API lấy giỏ hàng

      if(currentPage === 0) {
        setCartData(res.content);
      } else {
        setCartData((prevData) => {
          const newData = res.content.filter( 
            (newItem) =>
              !prevData.some((prevItem) => prevItem.productInstantId === newItem.productInstantId)
          );
          return [...prevData, ...newData];
        });
      } 
      setHasMore(currentPage + 1 < res.page.totalPages);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setSystemError(err.response?.data?.message || err.response?.data?.error || 'Mất kết nối máy chủ');
    } finally {
      setLoading(false); // Kết thúc loading (dù thành công hay thất bại)
      
    }
  }; 
  

  useEffect(() => {
    if (!Cookies.get("username")) {
      navigate(`/Login`);
      return;
    }
    getCart();
  }, [currentPage]);

  const loadMoreItems = () => {
  if(hasMore) setCurrentPage((prevPage) => prevPage + 1);
  };

  // Cập nhật tổng số tiền
  useEffect(() => {
    const newTotal = selectedItems.reduce((acc, id) => {
      const item = cartData.find((item) => item.productInstanceId === id);
      return item ? acc + item.price * (item.quantity || 1) : acc;
    }, 0);
    setTotal(newTotal);
  }, [selectedItems, cartData]); // Đảm bảo phụ thuộc đúng
  

  const handleQuantityChange = async (productInstanceId, quantity) => {
    if (quantity <= 0) return handleRemoveItem(productInstanceId); // Nếu số lượng <= 0, tự động xóa sản phẩm
    
    try {
      await updateQuantity(productInstanceId, quantity); // Gọi API để cập nhật số lượng
      setCartData((prev) =>
        prev.map((item) =>
          item.productInstanceId === productInstanceId ? { ...item, quantity } : item
        )
      );
      const response = await getMininalProfile()
      setTotalQuantityInCart(response.totalQuantityInCart)
    } catch (err) {
      const errorCode = err.response?.data?.code; // Lấy mã lỗi từ phản hồi API
      if (err.response?.status === 400 && errorCode === 2002) {
        toast.error('Số lượng vượt quá, vui lòng thử lại');
      } else {
        console.error('Lỗi cập nhật số lượng:', err); 
        toast.error('Không thể cập nhật số lượng!'); 
      }
    }
  };

  const handleRemoveItem = async (productInstanceId) => {
    try {
      await deleteFromCart(productInstanceId );
      setCartData((prev) =>
        prev.filter((item) => item.productInstanceId !== productInstanceId)
      );
      const response = await getMininalProfile()
      setTotalQuantityInCart(response.totalQuantityInCart)
      console.log(response, "123");
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    } catch(err) {
      console.error('Lỗi xóa sản phẩm:', err); // Debug lỗi API
        toast.error('Không thể xóa sản phẩm khỏi giỏ hàng!');
    }

  
  };
  

  const handleSelectItem = (productInstanceId) => {
    setSelectedItems((prev) =>
      prev.includes(productInstanceId)
        ? prev.filter((id) => id !== productInstanceId)
        : [...prev, productInstanceId]
    );
  };

  const handleProceed = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một mặt hàng để đặt hàng!');
    } else {
      const listProductToPlace = selectedItems.map((id) => {
        const item = cartData.find((item) => item.productInstanceId === id);
        return {
          productName: item.productName,
          productId: item.productId,
          listAtt: item.listName,
          instantId: item.productInstanceId,
          quantity: item.quantity,
          price: item.price,
        };
      });
      localStorage.setItem('ListProductToPlace', JSON.stringify(listProductToPlace));
      navigate('/place-Order');
    }
  };

  if (systemError) {
    return <ErrorMessage message={systemError} />;
  }

  const groupedCartData = cartData.reduce((groups, item) => {
    if (!groups[item.sellerId]) {
      groups[item.sellerId] = {
        sellerName: item.shopName,
        items: [],
      };
    }
    groups[item.sellerId].items.push(item);
    return groups;
  }, {});


  if (systemError) {
    return <ErrorMessage message={systemError} />;
  }
  return loading ? (
    <div className="flex justify-center items-center py-[500px]">
      <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
    </div>
  ) : (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="GIỎ" text2="HÀNG" />
      </div>

      {Object.keys(groupedCartData).length > 0 ? (
        Object.keys(groupedCartData).map((sellerId) => (
          <div key={sellerId} className="border mb-6 p-4 bg-gray-50">
            <Link to={``}><h2 className="text-lg font-bold mb-4">{groupedCartData[sellerId].sellerName}</h2></Link>
            {groupedCartData[sellerId].items.map((item) => (
              <div
                key={item.productInstanceId} // Key là productInstanceId duy nhất
                className="py-4 border-t text-gray-700 grid grid-cols-[0.5fr_4fr_0.5fr_0.5fr] sm:grid-cols-[1fr_4fr_2fr_1fr] items-center gap-4"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.productInstanceId)}
                  onChange={() => handleSelectItem(item.productInstanceId)}
                />
                <div className="flex items-start gap-6">
                  <img className="w-16 sm:w-20" src={item.IMG || 'default.jpg'} alt={item.productName} />
                  <div>
                    <Link to={`/product/${item.productId}`}>
                      <p className="text-xl sm:text-lg font-medium text-blue-500">{item.productName}</p>
                    </Link>
                    <div className="flex items-center gap-5 mt-2">
                      <p>{formatCurrency(item.price)}</p>
                      <ul>
                        {item.listValue.map((att, idx) => (
                          <li
                            key={`${item.productInstanceId}-${idx}`} // Đảm bảo key duy nhất cho từng thuộc tính
                            className="px-2 sm:px-3 sm:py-1 border bg-slate-50"
                          >
                            {att}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <input
                  type="number"
                  min={1}
                  max={9999} // Giới hạn số lượng tối đa nếu tồn tại maxQuantity
                  value={item.quantity || 1} // Đặt mặc định là 1 nếu quantity bị undefined
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  onChange={(e) => {
                    const newQuantity = Math.max(1, Math.min(Number(e.target.value), 9999));
                    if (newQuantity >= 1) {
                      handleQuantityChange(item.productInstanceId, newQuantity);
                    }
                  }}
                  onBlur={(e) => {
                    // Reset về giá trị hợp lệ nếu người dùng nhập sai và thoát khỏi input
                    const newQuantity = Number(e.target.value);
                    if (newQuantity < 1) {
                      handleQuantityChange(item.productInstanceId, 1); // Đặt về tối thiểu là 1
                    } else if (newQuantity > (item.maxQuantity || Infinity)) {
                      handleQuantityChange(item.productInstanceId, 10); // Đặt về tối đa
                    }
                  }}
                />
                <img
                  src={assets.bin_icon}
                  alt="Remove item"
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  onClick={() => handleRemoveItem(item.productInstanceId)}
                />
              </div>
            ))}
          </div>
        ))
        ) : (
          <div className="text-center p-6 bg-gray-50">
            <h2 className="text-xl font-bold">Giỏ hàng trống!</h2>
            <p>Chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy thêm sản phẩm để tiếp tục mua sắm.</p>
          </div>
      )}
 
      {
        hasMore ? <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={loadMoreItems}
          disabled={!hasMore}
          className="border-2 border-gray-300  px-4 py-2 font-medium hover:bg-gray-300"
        >
          Xem thêm
        </button>
      </div> : ""
      }
       
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <div className="text-2xl">
            <Title text1="TỔNG" text2="TIỀN" />
          </div>
          <div className="flex justify-between">
            <b>Tổng cộng</b>
            <b>{formatCurrency(total)}</b>
          </div>
          <div className="w-full text-end">
            <button
              onClick={handleProceed}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
