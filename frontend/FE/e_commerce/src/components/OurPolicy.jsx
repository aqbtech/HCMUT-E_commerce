import React from 'react'
import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center align-item py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      <div className='flex flex-col items-center'>
        <img src={assets.hinh6} className='w-[80px]' alt="" />
        <p className='font-semibold '>Easy Exchange Policy </p>
        <p className='text-gray-400'>We offer hassle free exchange policy</p>
      </div>
      <div className='flex flex-col items-center'>
        <img src={assets.hinh6} className='w-[80px]' alt="" />
        <p className='font-semibold '>7 Days return Policy</p>
        <p className='text-gray-400'>We provide 7 days free return policy</p>
      </div>
      <div className='flex flex-col items-center'>
        <img src={assets.hinh4} className='w-[80px]' alt="" />
        <p className='font-semibold '>Best customer support</p>
        <p className='text-gray-400'>we provide 24/7 custumer support</p>
      </div>
    </div>
  )
}

export default OurPolicy;
