import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { getProductsById, getReviewById } from "../fetchAPI/fetchProduct";
import { toast } from "react-toastify";
import { addToCart } from "../fetchAPI/fetchCart";
import ErrorMessage  from '/src/components/errorMessage'; 
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getMininalProfile } from "../fetchAPI/fetchAccount";

const Product = () => {
  const { productId } = useParams();
  const { navigate, curState, formatCurrency, setTotalQuantityInCart} = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [pageReview, setPageReview] = useState(0);
  const [review, setReview] = useState([]);
  const [selectedInstant, setSelectedInstant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewLoading, setIsReviewLoading] = useState(true);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchProduct = async () => {
    setIsLoading(true);
    try { 
      const response = await getProductsById(productId);
      setProductData(response);
      setImage(response?.images?.[0] || '');
    } catch (err) {
      toast.error("Lỗi khi lấy chi tiết sản phẩm")
    }
    setIsLoading(false);
  };

  const fetchReview = async () => {
    setIsReviewLoading(true);
    try {
      const response = await getReviewById(productId, pageReview);
      if(response) {
        setReview(response.content || []);
        setHasMore(review.length + response.content.length < response.totalElements);
      }
    } catch (err) {
      toast.error("Lỗi khi lấy đánh giá")
    }
    setIsReviewLoading(false);
  }; 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => { fetchProduct() }, [productId]);
  useEffect(() => { fetchReview() }, [pageReview, productId]);


  const handleNextPage = () => {
    setPageReview((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageReview > 0) {
      setPageReview((prev) => prev - 1);
    }
  };


  const allAttributesSelected = (attributes = selectedAttributes) => {
    if (!productData?.listAtt || productData.listAtt.length === 0) return true;
    return productData.listAtt.every(
      (att) =>
        attributes[att.name] !== undefined &&
        attributes[att.name] !== null &&
        attributes[att.name] !== ""
    );
  };

  const updateSelectedInstant = (attributes = selectedAttributes) => {
    if(productData?.listAtt?.length === 0) {
      setSelectedInstant(productData?.listInstants?.[0]);
      return;
    }
    if (!allAttributesSelected(attributes)) {
      setSelectedInstant(null); // Chưa chọn đủ thuộc tính
      return;
    }
    // Tìm instant phù hợp khi đã chọn đủ thuộc tính
    const matchingInstant = productData?.listInstants?.find((instant) =>
      Object.entries(instant.attributes).every(([key, value]) => attributes[key] === value)
    );
    setSelectedInstant(matchingInstant || "not_found"); // Không tìm thấy sẽ đặt là "not_found"
  };
    
  const handleAttributeSelection = (attributeName, value) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev, [attributeName]: prev[attributeName] === value ? null : value };
      updateSelectedInstant(newAttributes); // Gọi hàm để cập nhật selectedInstant
      return newAttributes;
    });
  };
  
  useEffect(() => {
      updateSelectedInstant();
  }, [selectedAttributes, productData?.listInstants]);

  
  const placeOrder = async (productName, productId, quantity, selectedAttributes, selectedInstant, IMG) => {
    if (curState !== "Login") return navigate("/Login", { state: { from: location.pathname } });
    if (!allAttributesSelected()) return toast.error("Vui lòng chọn tất cả các thuộc tính.");
    if(selectedInstant.quantityInStock < quantity) return toast.error("Sản phẩm hiện không đủ, vui lòng giảm bớt số lượng")
    if(quantity < 1) return toast.error("Số lượng không hợp lệ!")
    const ListAtt = Object.entries(selectedAttributes).map(([attName, value]) => ({
      "name" : attName,
      value,
    }));
  
    const body = {
      "IMG" : IMG,
      "productName": productName,
      "productId": productId,
      "listAtt": ListAtt,
      "instantId": selectedInstant.instantId,
      "quantity": quantity,
      "price": selectedInstant.price
    };

    // Ghi đè trực tiếp `ListProductToPlace` trong localStorage với `body`
    localStorage.setItem('ListProductToPlace', JSON.stringify([body]));
    // Điều hướng đến trang đặt hàng
    navigate('/place-Order');
  };

  const handleAddToCart = async (instantId, quantity, selectedInstant) => {
    if (curState !== "Login") return navigate("/Login", { state: { from: location.pathname } });
    if (!allAttributesSelected() && productData.listAtt?.length > 0) {
      return toast.error("Vui lòng chọn tất cả các thuộc tính.");
    }
    if (quantity < 1) return toast.error("Số lượng không hợp lệ!");
    if (selectedInstant.quantityInStock < quantity) {
      setQuantity(selectedInstant.quantityInStock); // Điều chỉnh số lượng
      return toast.error("Số lượng vượt quá hàng tồn kho, đã điều chỉnh về giá trị tối đa.");
    }
    if (isAddLoading) return;
    setIsAddLoading(true);
  
    try {
      await addToCart(instantId, quantity)
      const response = await getMininalProfile()
      setTotalQuantityInCart(response.totalQuantityInCart)
      toast.success("Thêm vào giỏ hàng thành công!");
    } catch(err) {
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng.");
      console.log(err);
    }
   
    setIsAddLoading(false);
  };


  return !isLoading ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full scrollbar-hidden">
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
          <h1 className="font-medium text-2xl mt-2">{productData.product_name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-yellow-500 font-medium text-lg">{productData.rating}</span>
            <img src={assets.star_icon} alt="Star" className="w-4 h-4" />
          </div>
          <p className="mt-5 text-3xl font-medium">
            {selectedInstant === null
              ? `${formatCurrency(productData.minPrice)}`
              : selectedInstant === "not_found"
              ? "Sản phẩm đã hết :((("
              : `${formatCurrency(selectedInstant.price)}`}
            </p>
          {productData.listAtt?.map((att, index) => (
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
              onChange={(e) => {
                const value = Math.max(1, Math.min(Number(e.target.value), selectedInstant?.quantityInStock || 1));
                if (selectedInstant && value > selectedInstant.quantityInStock) {
                  toast.error("Số lượng vượt quá hàng tồn kho, đã điều chỉnh về giá trị tối đa.");
                }
                setQuantity(value);
              }}
              value={quantity}
              type="number" defaultValue={quantity} className="border max-w-10 sm:max-w-20 px-1 my-5 sm:px-2 py-1"
            />
          </div>

          <button
            onClick={() => handleAddToCart(selectedInstant?.instantId, quantity, selectedInstant)}
            disabled={!selectedInstant || selectedInstant === "not_found"}
            className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 ${
              (!selectedInstant || selectedInstant === "not_found") ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isAddLoading ? <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-2xl" /> : "THÊM VÀO GIỎ HÀNG" }
          </button>
          <button
            onClick={() => placeOrder(productData.product_name, productId, quantity, selectedAttributes, selectedInstant, image)}
            disabled={!selectedInstant || selectedInstant === "not_found"}
            className={`bg-black text-white mx-4 px-8 py-3 text-sm active:bg-gray-700 ${
              (!selectedInstant || selectedInstant === "not_found") ? "opacity-50 cursor-not-allowed" : ""
            }`}
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
      <div className="mt-8 p-4 border rounded-lg shadow-md bg-white">
        {productData.seller ? (
          <div>
            <div className="flex items-center mb-2">
              <span className="text-blue-500 text-2xl mr-2">🏪</span> {/* Biểu tượng Unicode cho cửa hàng */}
              <Link 
                to={`/shop/${productData.seller.sellerId}`} 
                className="text-xl font-bold text-blue-600 hover:underline"
              >
                {productData.seller.shopName}
              </Link>
            </div>

            <p className="text-gray-700">
              <b>Địa chỉ:</b> {productData.seller.location}
            </p>
          </div>
        ) : (
          <p className="text-center italic text-gray-500">Thông tin của shop hiện không có!</p>
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

        {isReviewLoading ? ( // Hiển thị "Đang tải" khi review đang được tải
          (
            <div className="flex justify-center items-center py-[500px]">
              <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
            </div>
          )
        ) : review.length > 0 ? (
          review.map((reviewItem) => (
            <div
              key={reviewItem.reviewId}
              className="mt-3 p-4 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <b className="text-gray-800">{reviewItem.reviewerName}</b>
                  <span className="text-yellow-500 inline-flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <span key={index}>
                        {index + 1 <= Math.floor(reviewItem.rating) ? (
                          "★" // Sao đầy
                        ) : index < reviewItem.rating ? (
                          "⭑" // Sao nửa
                        ) : (
                          "☆" // Sao trống
                        )}
                      </span>
                    ))}
                    <span className="ml-2 text-gray-700 text-sm">({reviewItem.rating.toFixed(1)})</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500">{reviewItem.date}</p>
              </div>

              <p className="mt-2 text-gray-600">{reviewItem.reviewContent}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Chưa có bình luận nào.</p>
        )}


        {/* Nút phân trang */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={pageReview === 0}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Trang Trước
          </button>
          <p>{pageReview + 1}</p>
          <button
            onClick={handleNextPage}
            disabled={!hasMore}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Trang Tiếp
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
    </div>
  );
};

export default Product;
