import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id, image, name, price, rating}) => {
    const {currency, formatCurrency} = useContext(ShopContext)
  return (
    <Link
      className="block  rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      to={`/product/${id}`}
    >
      <div className="overflow-hidden rounded-t-lg">
        <img
          className="w-full h-[300px] object-cover hover:scale-110 transition-transform duration-300"
          src={image}
          alt={name}
        />
      </div>
      <div className="p-3">
        <p className="text-gray-800 text-base font-semibold line-clamp-2">
          {name}
        </p>
        <p className="text-lg font-bold text-blue-600 mt-2">
          {formatCurrency(price)}
        </p>
        <div className="flex items-center mt-2">
          {[...Array(Math.floor(rating))].map((_, index) => (
            <span key={index} className="text-yellow-500">&#9733;</span> // Icon sao
          ))}
          {rating % 1 !== 0 && <span className="text-yellow-500">&#9734;</span>} 
          <span className="text-sm text-gray-600 ml-2">({rating})</span>
        </div>
      </div>
    </Link>

  )
}

export default ProductItem 
