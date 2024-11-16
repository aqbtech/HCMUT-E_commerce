import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { getProductsById, getReviewById, getDetailProduct } from "../fetchAPI/fetchProduct";
import { toast } from "react-toastify";
import { addToCart } from "../fetchAPI/fetchCart";
import ErrorMessage  from '/src/components/errorMessage';

const Product = () => {
  const { productId } = useParams();
  const { navigate, curState, systemError, setSystemError, formatCurrency } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [pageReview, setPageReview] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [review, setReview] = useState([]);
  const [selectedInstant, setSelectedInstant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewLoading, setIsReviewLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchProduct = async () => {
    setIsLoading(true);
    try { 
      const response = await getProductsById(productId);
      if(!response) setSystemError("Not_Found")
      setProductData(response);
      setImage(response?.images?.[0] || '');
    } catch (err) {
      setSystemError(err.response?.data?.message || err.response?.data?.error || "Mất kết nối máy chủ");
    }
    setIsLoading(false);
  };

  const fetchReview = async () => {
    setIsReviewLoading(true);
    try {
      const response = await getReviewById(productId, pageReview);
      if(response) {
        setReview(response.review);
        if(pageReview >= response.totalPages) setHasMore(false);
      }
    } catch (err) {
      setReview([]);
      setHasMore(false);
    }
    setIsReviewLoading(false);
  };

  useEffect(() => { fetchProduct() }, [productId]);
  useEffect(() => { fetchReview(); }, [pageReview, productId]);


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
      console.log("Khong co gi!");
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
    if(productData?.listAtt?.length !== 0) {
      updateSelectedInstant();
    }
  }, [selectedAttributes, productData?.listInstants]);

  
  const placeOrder = async (productName, productId, quantity, selectedAttributes, selectedInstant) => {
    if (curState !== "Login") return navigate("/Login", { state: { from: location.pathname } });
    if (!allAttributesSelected()) return toast.error("Vui lòng chọn tất cả các thuộc tính trước khi đặt hàng.");
  
    const ListAtt = Object.entries(selectedAttributes).map(([attName, value]) => ({
      "name" : attName,
      value,
    }));
  
    const body = { 
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
  

  const handleAddToCart = async (productId, quantity, instantId) => {
    if (curState !== "Login") return navigate("/Login", { state: { from: location } });
    if (!allAttributesSelected() && productData.listAtt?.length > 0) {
      return toast.error("Vui lòng chọn tất cả các thuộc tính trước khi đặt hàng.");
    }

    const body = {
      "productId" :productId,
      "instantId" : instantId,
      "quantity" : quantity,
    };

    await addToCart(body)
    .then(() => {
      toast.success("Thêm vào giỏ hàng thành công!")
    })
    .catch(() => {
      toast.error("Thêm vào giỏ hàng thất bại!")
    })
  };

  if (systemError) {
    return <ErrorMessage  message={systemError} />;
  }
  return !isLoading ? (
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
          <h1 className="font-medium text-2xl mt-2">{productData.product_name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <p className="pl-2">{productData.rating}</p>
            <p> <img src={assets.star_icon} alt="" /></p>
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
              onChange={(e) => setQuantity(e.target.value)}
              type="number" defaultValue={quantity} className="border max-w-10 sm:max-w-20 px-1 my-5 sm:px-2 py-1"
            />
          </div>

          <button
            onClick={() => handleAddToCart(productId, quantity, selectedInstant?.instantId)}
            disabled={!selectedInstant || selectedInstant === "not_found"}
            className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 ${
              (!selectedInstant || selectedInstant === "not_found") ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            THÊM VÀO GIỎ HÀNG
          </button>
          <button
            onClick={() => placeOrder(productData.product_name, productId, quantity, selectedAttributes, selectedInstant)}
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
      <div className="mt-8 text-sm text-gray-700">
        {productData.seller ? (
          <>
            <Link to={`/shop/${productData.seller.sellerId}`} className="text-blue-500">
              <b>{productData.seller.shopName}</b>
            </Link>
            <p>Địa chỉ: {productData.seller.location}</p>
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

        {isReviewLoading ? ( // Hiển thị "Đang tải" khi review đang được tải
          <p>Đang tải bình luận...</p>
        ) : review.length > 0 ? (
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
      <div className="loader" /> loading....
    </div>
  );
};

export default Product;
