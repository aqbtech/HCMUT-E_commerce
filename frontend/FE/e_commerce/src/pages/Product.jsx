import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const {currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/products?id=${productId}`)
      setProductData(response.data[0]);
      setImage(response.data[0].image[0]);
    } catch (error) {
      console.log('Error fetching product data:', error); // In ra lỗi nếu có
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {/* images */}
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt={`Product ${index}`}
              />
            ))}
          </div>
            {/* main image */}
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        {/* product info */}
        <div className="flex-1">
            <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              <img src={assets.star_icon} alt="" className="w-3 5"/>
              <img src={assets.star_icon} alt="" className="w-3 5"/>
              <img src={assets.star_icon} alt="" className="w-3 5"/>
              <img src={assets.star_icon} alt="" className="w-3 5"/>
              <img src={assets.star_dull_icon} alt="" className="w-3 5"/>
              <p className="pl-2">(122)</p>
            </div>
            <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
            <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
            <div className="flex flex-col gap-4 my-8">
              <p>Select size:</p>
              <div className="flex gap-2">
                {productData.sizes.map((item, index) => (
                  <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 hover:bg-gray-500 ${item === size ? 'border-orange-500' : '' } `} key={index}>{item}</button>
                ))}
              </div>
            </div>
            <button onClick={()=>addToCart(productData.id, size, productData.price)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">ADD TO CART</button>
            <hr className="mt-8 sm:w-4/5"/>
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days</p>
            </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Review(122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>Dầu cà phê: Đây là loại dầu hoạt tính được trích lý từ 100% bã cà phê Arabica, chúng có sự kết hợp độc đáo giữa axit palmitic và axit linoleic mang lại khả năng thẩm thấu tuyệt vời, từ đó hỗ trợ quá trình giữ nước cho da, tăng cường sức mạ.nh của hà.ng rào bả.o vệ da, giúp da trở nên khoẻ khoắn, mềm mại và rạng rỡ hơn. Ngoài ra, trong dầu cà phê hoạt tính còn chứa Tocopherols (vitamin E tự nhiên) giúp tăng cường chố.ng ôx.i hóa bằng cách tạo ra Nrf2 và giảm sản sinh các gốc tự do.</p>
          <p>Chiết xuất cà phê Đắk Lắk: Có tác dụng chố.ng o.xi hóa cho làn da, đặc biệt hàm lượng caffe.ine cao trong hạt cà phê nguyên chất Đắk Lắk sẽ giúp da trở nên săn chắc, đều màu hơn. Mùi hương nồng nàn của chiết xuất cà phê giúp khơi dậy cảm giác tràn đầy năng lượng vào mỗi buổi sáng.</p>
        </div>
      </div>
      
      {/* display related product */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} _id={productData.id}/>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;