import Title from '../Title';
import ProductItem from '../ProductItem';
 
const LatestProduct = ({data}) => {
 

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1={'HÀNG'} text2={'MỚI'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Nếu bạn đang tìm kiếm một trang web để mua và bán hàng trực tuyến thì ATOM.vn là một sự lựa chọn tuyệt vời dành cho bạn </p>
        </div>

        {/*Rendering Product */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 '>
          {
              data.map((item, index) => (
                <ProductItem key={index} id={item.id} image={item.image} name={item.name} price={item.price}/>
              ))
          }
        </div>
    </div>
  )
}

export default LatestProduct 
