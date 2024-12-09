import { assets } from '../../assets/assets'

const Footer = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  }
  return (
    <div>
      <hr className='mb-4'/>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm'>
        <div>
          <div className=' flex items-center'>
            <img src={assets.logo} className='mb-5 w-[100px]' alt="" />
            <p className='font-bold text-[36px]'>ATOM</p>
          </div>
            
            
          <p className='w-full md:w-2/3 text-gray-600 text-justify'>
              Nếu bạn đang tìm kiếm một trang web để mua và bán hàng trực tuyến thì ATOM.vn là một sự lựa chọn tuyệt vời dành cho bạn. 
              ATOM là trang thương mại điện tử cho phép người mua và người bán tương tác và trao đổi dễ dàng thông tin về sản phẩm và chương trình khuyến mãi của shop. 
              Do đó, việc mua bán trên ATOM trở nên nhanh chóng và đơn giản hơn. 
              Bạn có thể trò chuyện trực tiếp với nhà bán hàng để hỏi trực tiếp về mặt hàng cần mua.
          </p>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>ATOM</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>TRANG CHỦ</li>
                <li>VỀ CHÚNG TÔI</li>
                <li>CHÍNH SÁCH</li>
            </ul>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>THÔNG TIN LIÊN LẠC</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>0918 373 763</li>
                <li>Chinh.dang5504@hcmut.edu.vn</li>
            </ul>
        </div>
      </div>
      <div>
        <hr className='mb-4'/>
        <p className='py-5 text-sm text-center'>
          © 2024 ATOM. Tất cả các quyền được bảo lưu.
        </p>
      </div>
    </div>
  )
}

export default Footer
