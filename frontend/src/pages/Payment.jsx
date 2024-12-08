import React, { useState } from 'react';

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
  };

  const handlePaymentSubmit = () => {
    // Xử lý thanh toán tại đây
    console.log('Thanh toán qua:', selectedPayment);
  };

  return (
    <div className='min-h-screen'>
       <div className="bg-white p-8 mt-24 rounded shadow-lg text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Thanh Toán</h2>
        <div className="space-y-4 text-left">
          <div>
            <input
              type="radio"
              id="zalopay"
              name="paymentMethod"
              value="Ví ZaloPay"
              checked={selectedPayment === 'Ví ZaloPay'}
              onChange={handlePaymentChange}
              className="mr-2"
            />
            <label htmlFor="zalopay" className="text-lg text-blue-600">Ví ZaloPay</label>
          </div>

          <div>
            <input
              type="radio"
              id="visa"
              name="paymentMethod"
              value="Visa, Master, JCB"
              checked={selectedPayment === 'Visa, Master, JCB'}
              onChange={handlePaymentChange}
              className="mr-2"
            />
            <label htmlFor="visa" className="text-lg">Visa, Master, JCB (qua Cổng ZaloPay)</label>
          </div>

          <div>
            <input
              type="radio"
              id="atm"
              name="paymentMethod"
              value="Thẻ ATM"
              checked={selectedPayment === 'Thẻ ATM'}
              onChange={handlePaymentChange}
              className="mr-2"
            />
            <label htmlFor="atm" className="text-lg">Thẻ ATM (qua Cổng ZaloPay)</label>
          </div>

          <div className="text-sm text-gray-600 mt-2">
            <p>Các hình thức khác của Merchant Site như: COD, chuyển khoản, v.v...</p>
          </div>
        </div>

        <button
          onClick={handlePaymentSubmit}
          disabled={!selectedPayment}
          className="w-full mt-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-400"
        >
          Thanh Toán
        </button>
      </div>
    </div>
   
  );
};

export default Payment;
