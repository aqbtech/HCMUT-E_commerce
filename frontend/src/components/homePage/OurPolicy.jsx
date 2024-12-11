import { assets } from '../../assets/assets';

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center align-item py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      <div className='flex flex-col items-center'>
        <img src={assets.hinh6} className='w-[80px]' alt="" />
        <p className='font-semibold '>Chính sách đổi/trả dễ dàng</p>
        <p className='text-gray-400'>Chúng tôi cung cấp chính sách đổi trả tiện lợi</p>
      </div>
      <div className='flex flex-col items-center'>
        <img src={assets.hinh6} className='w-[80px]' alt="" />
        <p className='font-semibold '>Chính sách hoàn trả trong 7 ngày</p>
        <p className='text-gray-400'>Chúng tôi cung cấp chính sách hoàn trả miễn phí trong 7 ngày</p>
      </div>
      <div className='flex flex-col items-center'>
        <img src={assets.hinh4} className='w-[80px]' alt="" />
        <p className='font-semibold '>Dịch vụ hỗ trợ khách hàng tốt nhất</p>
        <p className='text-gray-400'>Chúng tôi cung cấp dịch vụ hỗ trợ khách hàng 24/7</p>
      </div>
    </div>
  )
}

export default OurPolicy;
