import Title from '../Title';
import ProductItem from '../ProductItem';
 
const LatestProduct = ({data}) => {
 

  return ( 
    <div className='my-10'>
        {/* <div className='text-center py-8 text-3xl'>
            <Title text1={'HÀNG'} text2={'MỚI'}/>
           
        </div> */}
        <div className="text-left py-8 text-xl">
          <Title text1={'SẢN'} text2={'PHẨM'} />
          <p className=' text-xs sm:text-sm md:text-base text-gray-600'>
           ATOM.vn là một sự lựa chọn tuyệt vời dành cho bạn </p>
        </div>
        {/*Rendering Product */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 '>
          {
              data?.map((item, index) => (
                <ProductItem key={index} id={item.id} image={item.image} name={item.name} price={item.price}/>
              ))
          }
        </div>
    </div>
  )
}

export default LatestProduct 
 