import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { getMyCart, updateQuantity, fetchCart } from '../fetchAPI/fetchCart';
import ErrorMessage from '/src/components/errorMessage';
import Cookies from 'js-cookie'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Cart = () => {
  const { systemError, setSystemError, formatCurrency, navigate, curState } = useContext(ShopContext);
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
      setHasMore(cartData.length + res.content.length < res.totalElements);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setSystemError(err.response?.data?.message || err.response?.data?.error || 'Mất kết nối máy chủ');
    } finally {
      setLoading(false); // Kết thúc loading (dù thành công hay thất bại)
      
    }
  };
  

  useEffect(() => {
    if (!Cookies.get("username")) {
      console.log(curState);
      navigate(`/Login`);
      return;
    }
    getCart();
  }, [currentPage]);

  // Cập nhật tổng số tiền
  useEffect(() => {
    const newTotal = selectedItems.reduce((acc, id) => {
      const item = cartData.find((item) => item.productInstantId === id);
      return item ? acc + item.price * item.quantity : acc;
    }, 0);
    setTotal(newTotal);
  }, [selectedItems, cartData]);

  const handleQuantityChange = (productInstantId, quantity) => {
    if (quantity <= 0) return handleRemoveItem(productInstantId);

    updateQuantity({ productInstantId, quantity })
      .then(() => {
        setCartData((prev) =>
          prev.map((item) =>
            item.productInstantId === productInstantId ? { ...item, quantity } : item
          )
        );
        toast.success('Cập nhật số lượng thành công!');
      })
      .catch((err) => {
        console.error('Lỗi cập nhật số lượng:', err);
        toast.error('Không thể cập nhật số lượng!');
      });
  };

  const handleRemoveItem = (productInstantId) => {
    updateQuantity({ productInstantId, quantity: 0 })
      .then(() => {
        setCartData((prev) =>
          prev.filter((item) => item.productInstantId !== productInstantId)
        );
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
      })
      .catch((err) => {
        console.error('Lỗi xóa sản phẩm:', err);
        toast.error('Không thể xóa sản phẩm khỏi giỏ hàng!');
      });
  };

  const handleSelectItem = (productInstantId) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.includes(productInstantId)
        ? prev.filter((id) => id !== productInstantId)
        : [...prev, productInstantId];
      return updatedItems;
    });
  };

  const handleProceed = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một mặt hàng để đặt hàng!');
    } else {
      const listProductToPlace = selectedItems.map((id) => {
        const item = cartData.find((item) => item.productInstantId === id);
        return {
          productName: item.productName,
          productId: item.productId,
          listAtt: item.ListAtt,
          instantId: item.productInstantId,
          quantity: item.quantity,
          price: item.price,
        };
      });
      localStorage.setItem('ListProductToPlace', JSON.stringify(listProductToPlace));
      navigate('/place-Order');
    }
  };

  const loadMoreItems = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (systemError) {
    return <ErrorMessage message={systemError} />;
  }

  // Gom nhóm sản phẩm theo sellerId
  const groupedCartData = cartData.reduce((groups, item) => {
    if (!groups[item.sellerId]) {
      groups[item.sellerId] = {
        sellerName: item.sellerName,
        items: [],
      };
    }
    groups[item.sellerId].items.push(item);
    return groups;
  }, {});

  return loading ? (
    <div className="flex justify-center items-center py-[500px]">
      <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
    </div>
  ) :  (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="GIỎ" text2="HÀNG" />
      </div>
      {Object.keys(groupedCartData).map((sellerId) => (
        <div key={sellerId} className="border mb-6 p-4 bg-gray-50">
          <h2 className="text-lg font-bold mb-4">{groupedCartData[sellerId].sellerName}</h2>
          {groupedCartData[sellerId].items.map((item) => (
            <div
              key={item.productInstantId}
              className="py-4 border-t text-gray-700 grid grid-cols-[0.5fr_4fr_0.5fr_0.5fr] sm:grid-cols-[1fr_4fr_2fr_1fr] items-center gap-4"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.productInstantId)}
                onChange={() => handleSelectItem(item.productInstantId)}
              />
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20" src={item.IMG} alt={item.productName} />
                <div>
                  <p className="text-xl sm:text-lg font-medium">{item.productName}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>{formatCurrency(item.price)}</p>
                    <ul>
                      {item.listValue.map((att, idx) => (
                        <li
                          key={idx}
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
                value={item.quantity}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                onChange={(e) =>
                  handleQuantityChange(item.productInstantId, Number(e.target.value))
                }
              />
              <img
                src={assets.bin_icon}
                alt="Remove item"
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                onClick={() => handleRemoveItem(item.productInstantId)}
              />
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={loadMoreItems}
          disabled={!hasMore}
          className="border px-4 py-2 font-medium hover:bg-gray-300 disabled:opacity-50"
        >
          Xem thêm
        </button>
      </div>
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
