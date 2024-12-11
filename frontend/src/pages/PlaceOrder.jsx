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
        setListProductToPlace([]); // Đặt lại listProductToPlace thành array rỗng
        const response = await getMininalProfile();
        setTotalQuantityInCart(response.totalQuantityInCart);
        if(method !== 'cod') {
          window.location.href = res.result.url;
        } else {
        toast.success("Đặt hàng thành công!");
        navigate("/orders");
      }
      setLoading(false);
    } catch (err) {
      toast.error("Quá trình đặt hàng bị lỗi, vui lòng thử lại");
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

      <div className="flex gap-4">
        {/* Bên trái: Hiển thị sản phẩm trong listProductToPlace */}
        <div className="flex-1">
          <Title text1="SẢN PHẨM" text2="ĐẶT HÀNG" />
          <div className="border rounded-lg p-6 mt-4 bg-white shadow-lg">
            {listProductToPlace.length > 0 ? (
              listProductToPlace.map((product, index) => (
                <div
                  key={index}
                  className="mt-2 px-2 py-2 border-b last:border-none"
                >
                  {/* Hình ảnh và thông tin sản phẩm */}
                  <div className="flex gap-6 text-sm mb-3">
                    <img
                      className="w-24 sm:w-32 object-cover rounded-lg border shadow-md"
                      src={product.IMG}
                      alt={product.productName}
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {product.productName || "Sản phẩm không xác định"}
                      </h2>

                      {/* Giá và Số lượng */}
                      <div className="mt-2">
                        <p className="text-gray-600">
                          <span className="font-medium text-lg">Giá:</span>{" "}
                          {product.sale > 0 ? (
                            <>
                              <span className="line-through mr-2 text-gray-500">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="font-bold text-red-600 text-2xl">
                                {formatCurrency(
                                  product.price * (1 - product.sale)
                                )}
                              </span>
                              <span className="ml-2 text-sm text-red-500">
                                (-{product.sale * 100}%)
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </p>

                        {/* Số lượng */}
                        <p className="text-gray-600 text-sm mt-2">
                          <span className="font-medium">Số lượng:</span>{" "}
                          {product.quantity}
                        </p>
                      </div>

                      {/* Thuộc tính dưới dạng ô nhỏ */}
                      {product.listAtt.length > 0 && (
                        <div className="flex gap-3 mt-3">
                          {product.listAtt.map(
                            (att, idx) =>
                              att && (
                                <div
                                  key={idx}
                                  className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-lg border"
                                >
                                  <span className="mr-1">
                                    {att.value || att}
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hiển thị khi không có thuộc tính */}
                  {product.listAtt.length === 0 && (
                    <p className="text-gray-500 text-sm mt-2">
                      Không có thuộc tính
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                Không có sản phẩm để đặt hàng
              </p>
            )}
          </div>
        </div>

        {/* Bên phải: Hiển thị tổng cộng, phương thức thanh toán */}
        <div className="w-full max-w-[400px]">
          <Title text1="THÔNG TIN" text2="THANH TOÁN" />
          <div className="border rounded p-4 mt-4">
            <div className="w-full">
              <div className="text-2xl">
                <Title text1={"TỔNG"} text2={"ĐƠN"} />
              </div>

              <div className="flex flex-col gap-2 mt-2 text-sm">
                <div className="flex justify-between">
                  <p>Tổng hàng</p>
                  <p>{formatCurrency(calculateTotal())}</p>
                </div>
              </div>
              <hr />
              <div className="flex justify-between">
                <p>Phí ship</p>
                <p>{formatCurrency(fakeShippingFee)}</p>
              </div>
              <hr />
              <div className="flex justify-between">
                <b>Tổng cộng</b>
                {/* <b>{currency} {getCartAmount() === 0 ? 0 : String(getCartAmount() + delivery_fee) + '.00'}</b> */}
                <b>{formatCurrency(calculateTotal() + fakeShippingFee)} </b>
              </div>
            </div>
            <div className="mt-8">
              <Title text1="PHƯƠNG THỨC" text2="THANH TOÁN" />
              <div className="flex gap-3 flex-col mt-4">
                <div
                    onClick={() => setMethod("zalo_wallet")}
                    className="flex items-center gap-3 border p-2 cursor-pointer"
                >
                  <p
                      className={`w-4 h-4 border rounded-full ${
                          method === "zalo_wallet" ? "bg-green-400" : ""
                      }`}
                  ></p>
                  <img className="h-5 mx-4" src={assets.zalo} alt=""/>
                  <p className="text-gray-500 text-sm font-medium mx-4">
                   Ví ZaloPay
                  </p>

                </div>
                <div
                    onClick={() => setMethod("visa")}
                    className="flex items-center gap-3 border p-2 cursor-pointer"
                >
                  <p
                      className={`w-4 h-4 border rounded-full ${
                          method === "visa" ? "bg-green-400" : ""
                      }`}
                  ></p>
                  <p className="text-gray-500 text-sm font-medium mx-4">
                    Visa, Mastercard, JCB (qua cổng ZaloPay)
                  </p>
                </div>
                <div
                    onClick={() => setMethod("atm")}
                    className="flex items-center gap-3 border p-2 cursor-pointer"
                >
                  <p
                      className={`w-4 h-4 border rounded-full ${
                          method === "atm" ? "bg-green-400" : ""
                      }`}
                  ></p>
                  <p className="text-gray-500 text-sm font-medium mx-4">
                    Thẻ ATM (qua cổng ZaloPay)
                  </p>
                </div>
                <div
                    onClick={() => setMethod("cod")}
                    className="flex items-center gap-3 border p-2 cursor-pointer"
                >
                  <p
                      className={`w-4 h-4 border rounded-full ${
                          method === "cod" ? "bg-green-400" : ""
                      }`}
                  ></p>
                  <p className="text-gray-500 text-sm font-medium mx-4">
                    Thanh toán khi nhận hàng
                  </p>
                </div>
              </div>
              {loading ? (
                  <AiOutlineLoading3Quarters/>
              ) : (
                  <button
                      onClick={() =>
                          handlePlaceOrder(
                              selectedAddressId,
                              listProductToPlace,
                              method
                          )
                      }
                      className="bg-black text-white px-8 py-3 text-sm mt-6 w-full"
                  >
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-2xl" />
                  ) : (
                    "Đặt Hàng"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
