import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Payment = () => {
  const [qrCode, setQrCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/payment/qr-code'); // API endpoint của bạn
        if (response.status === 200) {
          setQrCode(response.data.qrCodeUrl); // Backend trả về URL ảnh QR code
        } else {
          toast.error("Không thể tải QR code, vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Lỗi khi fetch QR code:", error);
        toast.error("Lỗi hệ thống, vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrCode();
  }, []);

  const handleBackToOrder = () => {
    navigate('/place-Order'); // Điều hướng về trang đặt hàng
  };

  const handlePaymentCompleted = () => {
    navigate('/order-summary'); // gọi API đã thành công chưa, nếu thành công rồi về trang chủ nè
  };

  return (
      <div className="flex flex-col items-center mt-48 h-screen">
        <div className="bg-white p-8 rounded shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Thanh Toán</h2>
          {isLoading ? (
              <p className="text-gray-700">Đang tải mã QR, vui lòng đợi...</p>
          ) : qrCode ? (
              <div>
                <img
                    src={qrCode}
                    alt="QR Code"
                    className="w-64 h-64 object-cover mx-auto border-2 border-gray-300 rounded-md"
                />
                <p className="text-sm text-gray-600 mt-4">Quét mã QR để thanh toán</p>
              </div>
          ) : (
              <p className="text-red-500">Không thể tải mã QR.</p>
          )}
          <div className="mt-6 flex justify-between gap-4">
            <button
                onClick={handleBackToOrder}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
            >
              Trở lại đặt hàng
            </button>
            <button
                onClick={handlePaymentCompleted}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
            >
              Đã thanh toán
            </button>
          </div>
        </div>
      </div>
  );
};

export default Payment;
