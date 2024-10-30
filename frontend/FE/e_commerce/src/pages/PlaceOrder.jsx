import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { fetchAddresses } from '../../fetchAPI/fetchAddress'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const { navigate } = useContext(ShopContext)

  // Lấy danh sách địa chỉ từ API
  useEffect(() => {
    const loadAddresses = async () => {
      const data = await fetchAddresses()
      setAddresses(data)
    }
    loadAddresses()
  }, [])

  const handleAddressChange = (e) => {
    if (e.target.value === 'addNew') {
      navigate('/myProfile?tab=address')
    } else {
      setSelectedAddressId(e.target.value);
    }
  };

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t '>
      {/* left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        {/* Dropdown chọn địa chỉ */}
        <select
          className='border border-gray-300 rounded p-3 mb-4 w-full'
          value={selectedAddressId || ''}
          onChange={handleAddressChange}
        >
          <option value="" disabled>Chọn địa chỉ giao hàng</option>
          {addresses.map((address) => (
            <option key={address.id} value={address.id}>
              {`${address.name} - ${address.detailAddress}, ${address.city}, ${address.province}`}
            </option>
          ))}
          <option value="addNew" className='text-red'>+ Thêm địa chỉ giao hàng</option>
        </select>


        {/* Hiển thị thông tin chi tiết của địa chỉ đã chọn */}
        {selectedAddressId && (
          <div className='border border-gray-300 rounded p-4'>
            {addresses
              .filter((address) => address.id === Number(selectedAddressId))
              .map((address) => (
                <div key={address.id}>
                  <p><strong>Name:</strong> {address.name}</p>
                  <p><strong>Phone:</strong> {address.phone}</p>
                  <p><strong>City:</strong> {address.city}</p>
                  <p><strong>Province:</strong> {address.province}</p>
                  <p><strong>Detail Address:</strong> {address.detailAddress}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* right side */}
      <div className='mt-8'>  
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div> 
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button 
              onClick={() => selectedAddressId ? navigate('/Orders') : toast.error('Please select an address')}
              className='bg-black text-white px-8 py-3 text-sm'
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
