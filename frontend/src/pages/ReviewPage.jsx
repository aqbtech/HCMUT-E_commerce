import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import {
  getReviewableProdcuts,
  submitProductReview,
} from "../fetchAPI/fetchOrders";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const ReviewPage = () => {
  const { systemError, setSystemError, formatCurrency, navigate } =
    useContext(ShopContext);

  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewableProducts, setReviewableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Fetch sản phẩm chờ đánh giá
  const fetchReviewableProducts = async () => {
    setLoading(true);
    try {
      const response = await getReviewableProdcuts();
      setReviewableProducts(response);
    } catch (err) {
      setSystemError(err.response?.data?.message || "Lỗi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Cookies.get("username")) {
        navigate(`/Login`);
        return;
      }

    fetchReviewableProducts();
  }, []);

  const handleSubmitReview = async () => {
  
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao");
      return;
    }

    const body ={
        productId: selectedProduct.instantId,
        orderId: selectedProduct.orderId,
        rating : rating,
        comment: reviewText,
     };
    if(reviewLoading) return;  
    setReviewLoading(true);
    try {
      // Gửi đánh giá qua API
      await submitProductReview(body);

      // Cập nhật danh sách sản phẩm
      const updatedProducts = reviewableProducts.map((product) =>
        product.reviewId === selectedProduct.reviewId
          ? {
              ...product,
              isReviewed: true,
              reviewInfo: {
                rating,
                content: reviewText,
                reviewDate: new Date().toISOString().split("T")[0],
              },
            }
          : product
      );

      setReviewableProducts(updatedProducts);
      setSelectedProduct(null);
      setRating(0);
      setReviewText("");
      toast.success("Đánh giá thành công!");
    } catch (err) {
      toast.error("Lỗi khi gửi đánh giá, vui lòng thử lại!");
    } finally {
        setReviewLoading(false);
    }
  };


  if(loading) return 
    (<div className="flex justify-center items-center py-[500px]">
        <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
    </div>)
  return (
    <div className="container mx-auto px-4 py-8">
      <Title text1="ĐÁNH" text2="GIÁ" />

      {reviewableProducts?.length === 0 ? (
        <div className="text-center text-gray-600 mt-8">
          Hiện tại không có sản phẩm nào chờ đánh giá
        </div>
      ) : (
        <div className="space-y-6">
          {reviewableProducts.map((product) => (
            <div
              key={product.reviewId}
              className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center"
            >
              {/* Thông tin sản phẩm */}
              <div className="flex items-center">
                <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-24 h-24 object-cover rounded mr-4"
                />
                <div>
                    <h3 className="font-semibold text-lg">{product.productName}</h3>
                    <p className="text-gray-600">Từ đơn hàng: {product.orderId}</p>
                    <p className="text-gray-600">Ngày mua: {product.orderDate}</p>

                    {/* Thuộc tính sản phẩm */}
                    {product.ListAtt && (
                    <ul className="mt-2 text-gray-600 text-sm">
                        {product.ListAtt.map((attr, index) => (
                        <li key={index}>
                            {attr.name}: {attr.value}
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
              </div>

                
              {/* Phần đánh giá hoặc nút */}
              <div className="flex items-center gap-4">
                {product.isReviewed ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          color={
                            index < product.reviewInfo.rating
                              ? "#ffc107"
                              : "#e4e5e9"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {product.reviewInfo.content}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Đã đánh giá ngày {product.reviewInfo.reviewDate}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Đánh giá ngay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal đánh giá */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Đánh giá sản phẩm</h2>
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className="cursor-pointer mr-1"
                  color={index < rating ? "#ffc107" : "#e4e5e9"}
                  onClick={() => setRating(index + 1)}
                  size={30}
                />
              ))}
            </div>

            <textarea
              placeholder="Nhận xét của bạn (tùy chọn)"
              className="w-full border rounded p-2 mb-4"
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {!reviewLoading ? "Gửi đánh giá" : <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
