import Title from '../Title'
import ProductItem from '../ProductItem'

const BestSeller = ({data}) => { 

  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'BÁN'} text2={'CHẠY'}/>
            <p className='w-3/4 m-auto text-xs sm:text-base text-gray-600'>
            Nếu bạn đang tìm kiếm một trang web để mua và bán hàng trực tuyến thì Shopee.vn là một sự lựa chọn tuyệt vời dành cho bạn
            </p>
        </div>
        
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6'>
            {
                data.map((item, index) => (
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
                ))
            }
        </div>
    </div>
  )
}

export default BestSeller
