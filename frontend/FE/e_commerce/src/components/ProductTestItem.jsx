import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const ProductTestItem = ({image, name, price}) => {
    const {currency} = useContext(ShopContext)
    
  return (
    <div className='flex justify-between text-base border w-[1000px] m-3'>
        <div className=''>
            <img src={image[0]} className='w-[80px] h-[80px] m-10' alt="img" />
        </div>
        <div className='flex flex-col flex-1 p-10'>
            <div>{name}</div>
            <div>{currency}{price}</div>
        </div>
    </div>

  )
}

export default ProductTestItem
