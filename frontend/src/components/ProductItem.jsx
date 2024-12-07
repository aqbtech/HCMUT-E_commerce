import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price, rating, sale }) => {
  const { formatCurrency } = useContext(ShopContext)

  // Tính giá sau giảm giá
  const discountPrice = sale > 0 ? price * (1 - sale) : price;
  const discountPercentage = sale > 0 ? Math.floor(sale * 100) : 0;

  return (
    <Link
      className="block rounded-lg shadow-2xl hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      to={`/product/${id}`}
    >
      <div className="overflow-hidden rounded-t-lg relative">
        <img
          className="w-full h-[300px] object-cover hover:scale-110 transition-transform duration-300"
          src={image}
          alt={name}
        />
        {sale > 0 && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
            -{discountPercentage}%
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-gray-800 text-base font-semibold line-clamp-2">
          {name}
        </p>
        <div className="flex items-center mt-2">
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(discountPrice)} {/* Hiển thị giá sau giảm giá */}
          </p>
          {sale > 0 && (
            <p className="text-sm text-gray-500 line-through ml-2">
              {formatCurrency(price)} {/* Hiển thị giá gốc */}
            </p>
          )}
        </div>
        <div className="flex items-center mt-2">
          {[...Array(Math.floor(rating))].map((_, index) => (
            <span key={index} className="text-yellow-500">&#9733;</span> // Icon sao
          ))}
          {rating % 1 !== 0 && <span className="text-yellow-500">&#9734;</span>} 
          <span className="text-sm text-gray-600 ml-2">({rating.toFixed(1)})</span>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
