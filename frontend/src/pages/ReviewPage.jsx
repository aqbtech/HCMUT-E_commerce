import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import {
    submitProductReview,
    getReviewableProducts,
} from "../fetchAPI/fetchOrders";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ReviewPage = () => {
    const { formatCurrency } = useContext(ShopContext);

    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewableProducts, setReviewableProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    // Fetch sản phẩm chờ đánh giá
    const fetchReviewableProducts = async () => {
        setLoading(true);
        try {
            const response = await getReviewableProducts();
            setReviewableProducts(response.orderReivewList);
        } catch (err) {
            console.log("Lỗi khi lấy đánh giá", err);
            setReviewableProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviewableProducts();
    }, []);

    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast.error("Vui lòng chọn số sao");
            return;
        }
        if(reviewText > 100) return toast.error("Nội dung đánh giá quá dài!")
        const body = {
            productInstanceId: selectedProduct.productInstanceId,
            img: selectedProduct.img,
            orderId: selectedProduct.orderId,
            rating: rating,
            comment: reviewText,
        };

        if (reviewLoading) return;
        setReviewLoading(true);
        try {
            // Gửi đánh giá qua API
            await submitProductReview(body);

            // Cập nhật danh sách sản phẩm
            const updatedProducts = reviewableProducts.map((product) =>
                product.orderId === selectedProduct.orderId
                    ? {
                        ...product,
                        review: true,
                        reviewInfo: {
                            rating,
                            comment: reviewText,
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-[500px]">
                <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen border-t pt-16">
            <Title text1="ĐÁNH" text2="GIÁ" />

            {reviewableProducts?.length === 0 ? (
                <div className="text-center text-gray-600 mt-8">
                    Hiện tại không có sản phẩm nào chờ đánh giá
                </div>
            ) : (
                <div className="space-y-6">
                    {reviewableProducts.map((product) => (
                        <div
                            key={product.orderId}
                            className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between"
                        >
                            {/* Hình ảnh sản phẩm */}
                            <div className="flex items-center">
                                <img
                                    src={product.img || "https://via.placeholder.com/96"} // Ảnh dự phòng
                                    alt={product.productName}
                                    className="w-24 h-24 object-cover rounded mr-4"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{product.productName}</h3>
                                    <p className="text-gray-600 text-sm mb-1">
                                        Đơn hàng: <span className="font-medium">{product.orderId}</span>
                                    </p>
                                    <p className="text-gray-600 text-sm mb-1">
                                        Giá:{" "}
                                        <span className="text-blue-500 font-bold">
                      {formatCurrency(product.price)}
                    </span>
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        {product.value.map((attr, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded mr-1"
                                            >
                        {attr}
                      </span>
                                        ))}
                                    </p>
                                </div>
                            </div>

                            {/* Phần sao và trạng thái */}
                            <div className="flex items-center gap-4">
                                <div className="flex">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            size={24}
                                            color={
                                                product.reviewInfo?.rating > index
                                                    ? "#ffc107"
                                                    : "#e4e5e9"
                                            }
                                            className="mx-1"
                                        />
                                    ))}
                                </div>
                                {product.review ? (
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        Xem chi tiết
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:shadow-lg transform hover:scale-105 transition duration-300"
                                    >
                                        Đánh giá ngay
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal xem chi tiết hoặc đánh giá */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedProduct.review ? "Chi tiết đánh giá" : "Đánh giá sản phẩm"}
                        </h2>

                        {/* Hiển thị sao */}
                        <div className="flex justify-center mb-4">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    className="cursor-pointer mr-1"
                                    color={index < (selectedProduct.review ? selectedProduct.reviewInfo.rating : rating) ? "#ffc107" : "#e4e5e9"}
                                    onClick={() => !selectedProduct.review && setRating(index + 1)}
                                    size={30}
                                />
                            ))}
                        </div>

                        {/* Hiển thị hoặc nhập nhận xét */}
                        {selectedProduct.review ? (
                            <p className="text-gray-600 text-sm text-center italic mb-4">
                                "{selectedProduct.reviewInfo.comment || "Không có nhận xét"}"
                            </p>
                        ) : (
                            <div>
                                <textarea
                                    placeholder="Nhận xét của bạn (tối đa 100 ký tự)"
                                    className={`w-full border rounded p-2 mb-1 ${
                                        reviewText.length > 500 ? "border-red-500" : ""
                                    }`}
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 100) {
                                            setReviewText(e.target.value);
                                        }
                                    }}
                                />
                                <div
                                    className={`text-right text-sm ${
                                        reviewText.length > 100 ? "text-red-500" : "text-gray-600"
                                    }`}
                                >
                                    {reviewText.length}/100
                                </div>
                            </div>
                        )}

                        {/* Nút hành động */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                            >
                                Đóng
                            </button>
                            {!selectedProduct.review && (
                                <button
                                    onClick={handleSubmitReview}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {!reviewLoading ? (
                                        "Gửi đánh giá"
                                    ) : (
                                        <AiOutlineLoading3Quarters className="animate-spin text-white" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;
