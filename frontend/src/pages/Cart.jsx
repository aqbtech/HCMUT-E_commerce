import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import {
  updateQuantity,
  fetchCart,
  deleteFromCart,
} from "../fetchAPI/fetchCart";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getMininalProfile } from "../fetchAPI/fetchAccount";
import {fetchCart_DB, updateQuantity_DB, deleteFromCart_DB} from "../fetchAPI/fetchDB.jsx";

const Cart = () => {
  const { formatCurrency, navigate, setTotalQuantityInCart } =
      useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu giỏ hàng
  const getCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // const res = await fetchCart(currentPage, 10);
      //
      // if (currentPage === 0) {
      //   setCartData(res.content);
      // } else {
      //   setCartData((prevData) => {
      //     const newData = res.content.filter(
      //         (newItem) =>
      //             !prevData.some(
      //                 (prevItem) =>
      //                     prevItem.productInstantId === newItem.productInstantId
      //             )
      //     );
      //     return [...prevData, ...newData];
      //   });
      // }
      // setHasMore(currentPage + 1 < res.page.totalPages);

      const res = await  fetchCart_DB();
      if(res.code !== 200) {
        return toast.error(res.message);
      } else {
        setCartData(res.result);
        toast.success("Lấy giỏ hàng thành công!");
      }
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, [currentPage]);

  const loadMoreItems = () => {
    if (hasMore) setCurrentPage((prevPage) => prevPage + 1);
  };

  // Cập nhật tổng số tiền
  useEffect(() => {
    const newTotal = selectedItems.reduce((acc, id) => {
      const item = cartData.find((item) => item.productInstanceId === id);
      return item ? acc + item.price * (1 - item.sale) * (item.quantity || 1) : acc;
    }, 0);
    setTotal(newTotal);
  }, [selectedItems, cartData]);

  const handleQuantityChange = async (productInstanceId, quantity) => {
    if (quantity <= 0) return handleRemoveItem(productInstanceId);

    try {
      //await updateQuantity(productInstanceId, quantity);
      const res = await updateQuantity_DB(productInstanceId, quantity); //DB
      if(res.code !== 200) {
        return toast.error(res.message);
      }
      setCartData((prev) =>
          prev.map((item) =>
              item.productInstanceId === productInstanceId
                  ? { ...item, quantity }
                  : item
          )
      );
      const response = await getMininalProfile();
      setTotalQuantityInCart(response.totalQuantityInCart);
      toast.success("Cập nhật số lượng sản phẩm thành công!")
    } catch (err) {
      // const errorCode = err.response?.data?.code;
      // if (err.response?.status === 400 && errorCode === 2002) {
      //   toast.error("Số lượng vượt quá, vui lòng thử lại");
      // } else {
      //   console.error("Lỗi cập nhật số lượng:", err);
      //   toast.error("Không thể cập nhật số lượng!");
      // }
      console.error("Lỗi cập nhật số  giỏ hàng:", err);
    }
  };

  const handleRemoveItem = async (productInstanceId) => {
    try {
      //await deleteFromCart(productInstanceId);
      const res = await deleteFromCart_DB(productInstanceId);
      if(res.code !== 200) {
        return toast.error(res.message);
      }
      setCartData((prev) =>
          prev.filter((item) => item.productInstanceId !== productInstanceId)
      );
      const response = await getMininalProfile();
      setTotalQuantityInCart(response.totalQuantityInCart);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
    }
  };

  const handleSelectItem = (productInstanceId) => {
    setSelectedItems((prev) =>
        prev.includes(productInstanceId)
            ? prev.filter((id) => id !== productInstanceId)
            : [...prev, productInstanceId]
    );
  };

  const getRandomShippingFee = () => {
    const min = 100; // phí ship tối thiểu
    const max = 500; // phí ship tối đa
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  const handleProceed = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một mặt hàng để đặt hàng!");
    } else {
      const fakeShippingFee = getRandomShippingFee();
      const listProductToPlace = selectedItems.map((id) => {
        const item = cartData.find((item) => item.productInstanceId === id);
        return {
          productName: item.productName,
          productId: item.productId,
          listAtt: item.listName,
          isCart: true,
          instantId: item.productInstanceId,
          quantity: item.quantity,
          price: item.price,
          IMG: item.IMG,
          sale: item.sale,
          fakeShippingFee : fakeShippingFee
        };
      });
      localStorage.setItem(
          "ListProductToPlace",
          JSON.stringify(listProductToPlace)
      );
      navigate("/place-Order");
    }
  };

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

  return loading ? (
      <div className="flex justify-center items-center py-[500px]">
        <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
      </div>
  ) : (
      <div className="border-t pt-14 min-h-screen">
        <div className="text-2xl mb-3">
          <Title text1="GIỎ" text2="HÀNG" />
        </div>

        {Object.keys(groupedCartData).length > 0 ? (
            Object.keys(groupedCartData).map((sellerId) => (
                <div key={sellerId} className="border mb-6 p-4 bg-gray-50">
                  <Link to={`/shopView/${sellerId}`}>
                    <h2 className="text-lg font-bold mb-4">
                      {groupedCartData[sellerId].sellerName}
                    </h2>
                  </Link>
                  {groupedCartData[sellerId].items.map((item) => (
                      <div
                          key={item.productInstanceId}
                          className="py-4 border-t text-gray-700 grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_0.5fr] items-center gap-4"
                      >
                        {/* Cột Checkbox */}
                        <div className="items-center justify-center ml-auto">
                          <input
                              type="checkbox"
                              checked={selectedItems.includes(item.productInstanceId)}
                              onChange={() => handleSelectItem(item.productInstanceId)}
                              className="w-8 h-8 cursor-pointer"
                          />
                        </div>
                        {/* Cột Hình ảnh */}
                        <div className="flex items-center justify-center">
                          <img
                              className="w-40 h-40 sm:w-36 sm:h-36 object-cover"
                              src={item.IMG || "default.jpg"}
                              alt={item.productName}
                          />
                        </div>

                        {/* Cột Tên và Thuộc tính */}
                        <div className="flex flex-col items-start gap-2">
                          <Link to={`/product/${item.productId}`}>
                            <p className="text-2xl font-bold text-blue-600">{item.productName}</p>
                          </Link>
                          <ul className="flex gap-2 flex-wrap">
                            {item.listValue.map(
                                (att, idx) =>
                                    att && (
                                        <li
                                            key={`${item.productInstanceId}-${idx}`}
                                            className="px-3 py-1 border bg-slate-50 rounded-md text-sm"
                                        >
                                          {att}
                                        </li>
                                    )
                            )}
                          </ul>
                        </div>

                        {/* Cột Giá tiền */}
                        <div className="flex items-start justify-start">
                          <div className="flex flex-col items-start gap-1">
                            {item.sale ? (
                                <>
                                  <p className="text-sm text-gray-500 line-through">
                                    {formatCurrency(item.price)}
                                  </p>
                                  <p className="text-lg font-bold text-red-600">
                                    {formatCurrency(item.price * (1 - item.sale))}
                                  </p>
                                </>
                            ) : (
                                <p className="text-lg font-medium">{formatCurrency(item.price)}</p>
                            )}
                          </div>
                        </div>


                        {/* Cột Số lượng */}
                        <div className="flex items-start justify-start">
                          <input
                              type="number"
                              min={1}
                              max={9999}
                              value={item.quantity || 1}
                              className="border w-14 text-center px-2 py-1"
                              onChange={(e) => {
                                const newQuantity = Math.max(1, Math.min(Number(e.target.value), 9999));
                                if (newQuantity >= 1) {
                                  handleQuantityChange(item.productInstanceId, newQuantity);
                                }
                              }}
                              onBlur={(e) => {
                                const newQuantity = Number(e.target.value);
                                if (newQuantity < 1) {
                                  handleQuantityChange(item.productInstanceId, 1);
                                } else if (newQuantity > (item.maxQuantity || Infinity)) {
                                  handleQuantityChange(item.productInstanceId, 10);
                                }
                              }}
                          />
                        </div>

                        {/* Cột Xóa */}
                        <div className="flex items-start justify-start">
                          <img
                              src={assets.bin_icon}
                              alt="Remove item"
                              className="w-6 h-6 cursor-pointer"
                              onClick={() => handleRemoveItem(item.productInstanceId)}
                          />
                        </div>
                      </div>

                  ))}
                </div>
            ))
        ) : (
            <div className="text-center p-6 bg-gray-50">
              <h2 className="text-xl font-bold">Giỏ hàng trống!</h2>
              <p>
                Chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy thêm sản phẩm để
                tiếp tục mua sắm.
              </p>
            </div>
        )}

        {hasMore ? (
            <div className="flex justify-center gap-4 mt-8">
              <button
                  onClick={loadMoreItems}
                  disabled={!hasMore}
                  className="border-2 border-gray-300  px-4 py-2 font-medium hover:bg-gray-300"
              >
                Xem thêm
              </button>
            </div>
        ) : (
            ""
        )}

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
