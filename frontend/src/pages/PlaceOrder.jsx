import { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { getAddress} from '../fetchAPI/fetchAddress';
import { toast } from 'react-toastify';
import CartTotal from '../components/global/CartTotal';
import { createOrder } from '../fetchAPI/fetchOrders';
import AddressModal from '../components/profilePage/AddressModal';
import { createAddress } from '../fetchAPI/fetchAddress';
import ErrorMessage  from '/src/components/errorMessage';
import Cookies from 'js-cookie'

const PlaceOrder = () => { 
  const [method, setMethod] = useState('cod');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { listProductToPlace, setListProductToPlace, navigate, username, curState, systemError, setSystemError } = useContext(ShopContext);

// Lấy danh sách địa chỉ từ API
useEffect(() => {
  if(!Cookies.get('username')) {
    console.log(curState);
    navigate(`/Login`)
    return
  }
  const loadAddresses = async () => {
    try {
      const res = await getAddress();
      setAddresses(res); // Đảm bảo `res` được truyền đúng vào `setAddresses`
    } catch (err) {
      setSystemError(err.response?.data?.message || err.response?.data?.error || "Mất kết nối máy chủ");
      console.log("Lỗi khi tải địa chỉ:", err);
    }
  };

  loadAddresses(); 
}, []);

  // Xử lý lưu địa chỉ mới
  const handleSaveAddress = async (newAddress) => { 
    try {
      const savedAddress = await createAddress(newAddress);
      setAddresses([...addresses, savedAddress]); // Thêm địa chỉ mới vào danh sách
      setSelectedAddressId(savedAddress.id); // Chọn địa chỉ mới làm mặc định
      setIsModalOpen(false); // Đóng modal
      toast.success('Đã lưu địa chỉ mới thành công');
    } catch (error) {
      toast.error('Lỗi khi lưu địa chỉ, vui lòng thử lại');
      throw error
    }
  };

  // Xử lý thay đổi địa chỉ
  const handleAddressChange = (e) => {
    if (e.target.value === 'addNew') {
      setIsModalOpen(true); // Mở modal nếu chọn "Thêm địa chỉ mới"
    } else {
      setSelectedAddressId(e.target.value);
    }
  };

  const calculateTotal = () => {
    if (!listProductToPlace || listProductToPlace.length === 0) return 0;
  
    return listProductToPlace.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = (selectedAddressId, listProductToPlace, method) => {


    if (!selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }
 
    const bodyResponse = {
      "buyerId" : username,
      "listProduct" : listProductToPlace,
      "deliveryAddress" : selectedAddressId,
      "method" : method,
      "price" : calculateTotal()
    }

   createOrder(bodyResponse)
   .then(() => {
    setListProductToPlace({});
    toast.success("Đặt hàng thành công!");
    navigate('/');
   })
   .catch((err) => {
    toast.error("Quá trình đặt hàng bị lỗi, vui lòng thử lại")
    console.log("lỗi khi đặt đơn hàng:", err);
   })
  };
  if (systemError) {
    return <ErrorMessage  message={systemError} />;
  }
  return (
    <div className="flex flex-col gap-4 pt-5 min-h-[80vh] border-t">
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
          value={selectedAddressId || ''}
          onChange={handleAddressChange}
        >
          <option value="" disabled>Chọn địa chỉ giao hàng</option>
          
          {addresses?.map((address) => (
            <option key={address.id} value={address.id}>
              {`${address.name} ${address.phone} - ${address.detailAddress}, ${address.ward}, ${address.province},${address.district}`}
            </option>
          ))}
          <option value="addNew" className="text-red">+ Thêm địa chỉ mới</option>
        </select>
      </div>

      <div className="flex gap-4">
        {/* Bên trái: Hiển thị sản phẩm trong listProductToPlace */}
        <div className="flex-1">
          <Title text1="SẢN PHẨM" text2="ĐẶT HÀNG" />
          <div className="border rounded p-4 mt-4">
            {listProductToPlace.map((product, index) => (
              <div key={index} className="mb-4">
                <h2 className="font-medium text-lg">{product.productName}</h2>
                <p>Giá: {product.price}</p>
                <p>Số lượng: {product.quantity}</p>
                <p>Thuộc tính:</p>
                <ul>
                  {product?.ListAtt?.map((att, idx) => (
                    <li key={idx}>{att.attName}: {att.value}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bên phải: Hiển thị tổng cộng, phương thức thanh toán */}
        <div className="w-full max-w-[400px]">
          <Title text1="THÔNG TIN" text2="THANH TOÁN" />
          <div className="border rounded p-4 mt-4">
          <div className='w-full'>
              <div className='text-2xl'>
                  <Title text1={'CART'} text2={'TOTAL'}/>
              </div>
            
              <div className='flex flex-col gap-2 mt-2 text-sm'>
                  <div className='flex justify-between'>
                      <p>Tổng hàng</p>
                      <p>{calculateTotal() + '.000'} VNĐ</p>
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
                  <b>{calculateTotal() + 10 + '.000'} VNĐ  </b>
              </div>
            </div>
            <div className="mt-8">
              <Title text1="PHƯƠNG THỨC" text2="THANH TOÁN" />
              <div className="flex gap-3 flex-col mt-4">
                <div onClick={() => setMethod('zalo')} className="flex items-center gap-3 border p-2 cursor-pointer">
                  <p className={`w-4 h-4 border rounded-full ${method === 'zalo' ? 'bg-green-400' : ''}`}></p>
                  <img className="h-5 mx-4" src={assets.zalo} alt="" /> zaloPay
                </div>
                <div onClick={() => setMethod('momo')} className="flex items-center gap-3 border p-2 cursor-pointer">
                  <p className={`w-4 h-4 border rounded-full ${method === 'momo' ? 'bg-green-400' : ''}`}></p>
                  <img className="h-5 mx-4" src={assets.momo} alt="" /> momo
                </div>
                <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 cursor-pointer">
                  <p className={`w-4 h-4 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                  <p className="text-gray-500 text-sm font-medium mx-4">Thanh toán khi nhận hàng</p>
                </div>
              </div>

              <button
                onClick={() => handlePlaceOrder(selectedAddressId, listProductToPlace, method)}
                className="bg-black text-white px-8 py-3 text-sm mt-6 w-full"
              >
                ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default PlaceOrder;
