import { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { getAddress } from "../fetchAPI/fetchAddress";
import { toast } from "react-toastify";
import { createOrder } from "../fetchAPI/fetchOrders";
import AddressModal from "../components/profilePage/AddressModal";
import { createAddress } from "../fetchAPI/fetchAddress";
import Cookies from "js-cookie";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getMininalProfile } from "../fetchAPI/fetchAccount.jsx";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listProductToPlace, setListProductToPlace] = useState([]);
  const { navigate, formatCurrency, setTotalQuantityInCart } =
    useContext(ShopContext);
  const [fakeShippingFee, setFakeShippingFee] = useState(0);
  
  // Lấy danh sách địa chỉ từ API
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await getAddress();
        setAddresses(res); // Đảm bảo `res` được truyền đúng vào `setAddresses`
      } catch (err) {
        console.log("Lỗi khi tải địa chỉ:", err);
      }
    };

    loadAddresses();
  }, []);

  useEffect(() => {
    const savedListProductToPlace = localStorage.getItem("ListProductToPlace");
    if (savedListProductToPlace) {
      const parsedList = JSON.parse(savedListProductToPlace); 
      setListProductToPlace(parsedList);
      setFakeShippingFee(parsedList[0]?.fakeShippingFee * 100 || 0); 
    }
  }, []);

  // Xử lý lưu địa chỉ mới
  const handleSaveAddress = async (newAddress) => {
    try {
      const savedAddress = await createAddress(newAddress);
      const addressData = await getAddress();
      setAddresses(addressData);
      setSelectedAddressId(savedAddress.id); // Chọn địa chỉ mới làm mặc định
      setIsModalOpen(false); // Đóng modal
      toast.success("Đã lưu địa chỉ mới thành công");
    } catch (error) {
      toast.error("Lỗi khi lưu địa chỉ, vui lòng thử lại");
      throw error;
    }
  };

  // Xử lý thay đổi địa chỉ
  const handleAddressChange = (e) => {
    if (e.target.value === "addNew") {
      setIsModalOpen(true); // Mở modal nếu chọn "Thêm địa chỉ mới"
    } else {
      setSelectedAddressId(e.target.value);
    }
  };

  const calculateTotal = () => {
    if (!listProductToPlace || listProductToPlace.length === 0) return 0;

    return listProductToPlace.reduce((total, product) => {
      return total + product.price * product.quantity * (1 - product.sale);
    }, 0);
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async (
    selectedAddressId,
    listProductToPlace,
    method
  ) => {
    if (loading) return;

    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    const deliveryAddress = addresses.find(
      (address) => address.id === selectedAddressId
    );

    if (!deliveryAddress) {
      toast.error("Không tìm thấy địa chỉ giao hàng, vui lòng thử lại");
      return;
    }
    setLoading(true);
    const listProductPlace = listProductToPlace.map((product) => ({
      productId: product.productId,
      instantId: product.instantId,
      quantity: product.quantity,
    }));
    let isCart = false;
    if (listProductToPlace[0].isCart) isCart = true;
    const bodyRequest = {
      username: Cookies.get("username"),
      listProduct: listProductPlace,
      deliveryAddress: deliveryAddress,
      method: method,
      total: calculateTotal(),
      isCart: isCart,
      fakeShippingFee: fakeShippingFee,
    };
    try {
        const res = await createOrder(bodyRequest);

        const response = await getMininalProfile();
        setTotalQuantityInCart(response.totalQuantityInCart);
        if(method !== 'cod') {
          if (res?.result?.url) {
            window.location.href = res.result.url;
          } else {
            console.error("URL không hợp lệ.", res);
            toast.error("Đã xảy ra lỗi khi thanh toán!")
            navigate("/orders")
          }
        } else {
          toast.success("Đặt hàng thành công!");
          navigate("/orders");
        }
      setListProductToPlace([]);
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false);
      console.log("lỗi khi đặt đơn hàng:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-5 border-t">
      {/* Phần địa chỉ */}
      <div className="mb-4">
        <Title text1="ĐỊA CHỈ" text2="GIAO HÀNG" />
        {/* Modal thêm địa chỉ */}
        {isModalOpen && (
          <AddressModal
            onClose={() => setIsModalOpen(false)} //mở form điền thông tin
            onSave={handleSaveAddress} // Gọi API lưu địa chỉ khi thêm địa chỉ
            initialData={null}
          />
        )}
        <select
          className="border border-gray-300 rounded p-3 w-full mt-2"
          value={selectedAddressId || ""}
          onChange={handleAddressChange}
        >
          <option value="" disabled>
            Chọn địa chỉ giao hàng
          </option>

          {addresses?.map((address) => (
            <option key={address.id} value={address.id}>
              {`${address.name} ${address.phone} - ${address.detailAddress}, ${address.ward}, ${address.province},${address.district}`}
            </option>
          ))}
          <option value="addNew" className="text-red">
            + Thêm địa chỉ mới
          </option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Bên trái: Hiển thị sản phẩm trong listProductToPlace */}
        <div className="flex-1">
          <Title text1="SẢN PHẨM" text2="ĐẶT HÀNG"/>
          <div className="border rounded-lg p-6 mt-4 bg-white shadow-lg">
            {listProductToPlace.length > 0 ? (
                <div className="space-y-4">
                  {listProductToPlace.map((product, index) => (
                      <div
                          key={index}
                          className="px-4 py-4 border-b last:border-none flex flex-wrap gap-4 items-start"
                      >
                        {/* Hình ảnh sản phẩm */}
                        <img
                            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-lg border shadow-md"
                            src={product.IMG}
                            alt={product.productName}
                        />
                        {/* Thông tin sản phẩm */}
                        <div className="flex-1">
                          <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            {product.productName || "Sản phẩm không xác định"}
                          </h2>
                          {/* Giá và Số lượng */}
                          <div className="text-sm text-gray-600">
                            <p className="mb-1">
                              <span className="font-medium text-base">Giá:</span>{" "}
                              {product.sale > 0 ? (
                                  <>
                        <span className="line-through mr-2 text-gray-500">
                          {formatCurrency(product.price)}
                        </span>
                                    <span className="font-bold text-red-600 text-xl">
                          {formatCurrency(product.price * (1 - product.sale))}
                        </span>
                                    <span className="ml-2 text-sm text-red-500">
                          (-{product.sale * 100}%)
                        </span>
                                  </>
                              ) : (
                                  <span className="text-xl">
                        {formatCurrency(product.price)}
                      </span>
                              )}
                            </p>
                            <p className="mt-1">
                              <span className="font-medium">Số lượng:</span>{" "}
                              {product.quantity}
                            </p>
                          </div>
                          {/* Thuộc tính dưới dạng ô nhỏ */}
                          {product.listAtt.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {product.listAtt.map((att, idx) => (
                                    att && (
                                        <div
                                            key={idx}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-lg border"
                                        >
                                          {att.value || att}
                                        </div>
                                    )
                                ))}
                              </div>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">Không có sản phẩm để đặt hàng</p>
            )}
          </div>
        </div>

        {/* Bên phải: Hiển thị tổng cộng, phương thức thanh toán */}
        <div className="w-full lg:w-[400px]">
          <Title text1="THÔNG TIN" text2="THANH TOÁN"/>
          <div className="border rounded-lg p-6 mt-4 bg-white shadow-lg">
            <div className="space-y-4">
              {/* Tổng đơn hàng */}
              <div>
                <Title text1="TỔNG" text2="ĐƠN"/>
                <div className="flex justify-between mt-2 text-sm">
                  <p>Tổng hàng</p>
                  <p>{formatCurrency(calculateTotal())}</p>
                </div>
                <hr className="my-2"/>
                <div className="flex justify-between text-sm">
                  <p>Phí ship</p>
                  <p>{formatCurrency(fakeShippingFee)}</p>
                </div>
                <hr className="my-2"/>
                <div className="flex justify-between font-bold text-base">
                  <p>Tổng cộng</p>
                  <p>{formatCurrency(calculateTotal() + fakeShippingFee)}</p>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div>
                <Title text1="PHƯƠNG THỨC" text2="THANH TOÁN"/>
                <div className="flex flex-col gap-4 mt-4">
                  {[
                    {id: "zalo_wallet", label: "Ví ZaloPay", icon: assets.zalo},
                    {id: "visa", label: "Visa, Mastercard, JCB (qua cổng ZaloPay)"},
                    {id: "atm", label: "Thẻ ATM (qua cổng ZaloPay)"},
                    {id: "cod", label: "Thanh toán khi nhận hàng"},
                  ].map(({id, label, icon}) => (
                      <div
                          key={id}
                          onClick={() => setMethod(id)}
                          className="flex items-center gap-4 border p-3 cursor-pointer rounded-lg hover:shadow-md"
                      >
                        <div
                            className={`w-5 h-5 border rounded-full flex items-center justify-center ${
                                method === id ? "bg-green-500" : ""
                            }`}
                        ></div>
                        {icon && <img className="h-6" src={icon} alt=""/>}
                        <p className="text-sm text-gray-700 font-medium">{label}</p>
                      </div>
                  ))}
                </div>
              </div>

              {/* Nút đặt hàng */}
              <button
                  onClick={() => handlePlaceOrder(selectedAddressId, listProductToPlace, method)}
                  className="bg-black text-white px-8 py-3 mt-6 text-sm rounded-lg hover:bg-gray-700 w-full flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={loading}
              >
                {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-white text-lg"/>
                ) : (
                    "Đặt Hàng"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PlaceOrder;
