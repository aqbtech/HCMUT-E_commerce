import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { getProductsById, getReviewById } from "../fetchAPI/fetchProduct";
import { toast } from "react-toastify";
import { addToCart } from "../fetchAPI/fetchCart";

const Product = () => {
  const { productId } = useParams();
  const { setListProductToPlace, navigate, ListProductToPlace } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [pageReview, setPageReview] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [review, setReview] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getProductsById(productId);
      setProductData(response);
      if (response?.images?.length > 0) {
        setImage(response.images[0]);  
      }
    }; 
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReview = async () => {
      const response = await getReviewById(productId, pageReview, prevPage);
      setReview(response || []);
    };
    fetchReview();
  }, [pageReview, productId, prevPage]);

  const handleNextPage = () => {
    setPrevPage(pageReview);
    setPageReview((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageReview > 1) {
      setPrevPage(pageReview);
      setPageReview((prev) => prev - 1);
    }
  };

  const handleAttributeSelection = (attributeName, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: prev[attributeName] === value ? null : value,
    }));
  };

  const allAttributesSelected = () => {
    return !productData?.attributes || productData.attributes.every((att) => selectedAttributes[att.name]);
  };

  const placeOrder = async (productName, productId, quantity, selectedAttributes, price) => {
    if (!allAttributesSelected()) {
      toast.error("Vui lòng chọn tất cả các thuộc tính trước khi đặt hàng.");
      return;
    }

    const ListAtt = Object.entries(selectedAttributes).map(([attName, value]) => ({
      attName,
      value,
    }));

    const body = {
      productName,
      productId,
      ListAtt,
      quantity,
      price
    };
     
    setListProductToPlace((prevList) => [...prevList, body]);
    navigate('/place-Order');
  };

  const handleAddToCart = async (productName, productId, quantity, selectedAttributes, price) => {
    if (!allAttributesSelected()) {
      toast.error("Vui lòng chọn tất cả các thuộc tính trước khi thêm vào giỏ hàng.");
      return;
    }
   
    const ListAtt = Object.entries(selectedAttributes).map(([attName, value]) => ({
      attName,
      value,
    }));

    const body = {
      productName,
      productId,
      ListAtt,
      quantity,
      price
    };

    await addToCart(body);
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.images?.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt={`Product ${index}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <p>{productData.rating} <img src={assets.star_icon} alt="" /></p>
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{productData.price} .000VNĐ</p>
          
          {productData.attributes?.map((att, index) => (
            <div key={index} className="flex flex-col gap-2 my-5">
              <p>{att.name}:</p> 
              <div className="flex gap-2">
                {att.values?.map((value, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAttributeSelection(att.name, value)}
                    className={`border py-2 px-4 ${selectedAttributes[att.name] === value ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '4px',
                      borderColor: selectedAttributes[att.name] === value ? 'orange' : '#ccc',
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p>Số lượng</p>
            <input 
              min={1}
              onChange={(e) => setQuantity(e.target.value)}
              type="number" defaultValue={quantity} className="border max-w-10 sm:max-w-20 px-1 my-5 sm:px-2 py-1"
            />
          </div>

          <button
            onClick={() => handleAddToCart(productData.name, productId, quantity, selectedAttributes, productData.price)}
            className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 && "opacity-50 cursor-not-allowed"}`}
          >
            THÊM VÀO GIỎ HÀNG
          </button>
          <button
            onClick={() => placeOrder(productData.name, productId, quantity, selectedAttributes, productData.price)}
            className={`bg-black text-white mx-4 px-8 py-3 text-sm active:bg-gray-700 && "opacity-50 cursor-not-allowed"}`}
          >
            ĐẶT HÀNG
          </button>

          <hr className="mt-8 sm:w-4/5"/>
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      <hr /> 
      <div className="mt-8 text-sm text-gray-700">
        {productData.seller ? (
          <>
            <Link to={`/shop/${productData.seller.sellerId}`} className="text-blue-500">
              <b>{productData.seller.shopName}</b>
            </Link>
            <p>Địa chỉ: {productData.seller.Tinh}</p>
          </>
        ) : (
          <p>Thông tin của shop hiện không có!</p>
        )}
      </div>
      <hr />
      <div className="mt-5">
        <h2 className="text-lg font-bold">Mô tả sản phẩm</h2>
        <p className="mt-2 text-gray-600">{productData.description}</p>
      </div>
      <hr />
      <div className="mt-5">
        <h2 className="text-lg font-bold">Bình luận của khách hàng</h2>
        {review.length > 0 ? (
          review.map((reviewItem) => (
            <div key={reviewItem.reviewId} className="mt-3 border-b pb-3">
              <p><b>{reviewItem.reviewerName}</b> - <span className="text-yellow-500">Rating: {reviewItem.rating}</span></p>
              <p>{reviewItem.contentReview}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Chưa có bình luận nào.</p>
        )}

        {/* Nút phân trang */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={pageReview === 1}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Trang Trước
          </button>
          <p>{pageReview}</p>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
          >
            Trang Tiếp
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
