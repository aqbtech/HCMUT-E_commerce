import React, {useContext, useEffect, useState} from 'react'
import { ShopContext } from '../context/ShopContext'
import {disableProduct, enableProduct, productDetail} from "../fetchAPI/fetchProduct.jsx";
import {toast} from "react-toastify";
import product from "../pages/Product.jsx";
import AddProductModal from "./shopPage/AddProductModal.jsx";
import UpdateProductModal from "./shopPage/UpdateProductModal.jsx";
const ProductTestItem = ({image, name, price, rating, status, productId}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currency } = useContext(ShopContext);
    const [isVisible, setIsVisible] = useState(status === "ENABLED"); // Trạng thái ẩn/hiện sản phẩm, mặc định theo status
    const [detailProduct, setDetailProduct] = useState(null);
    useEffect(() => {
        setIsVisible(status === "ENABLED");
    }, [status]);

    const handleUpdate = async () => {
        try {
            const res = await productDetail(productId);
            setDetailProduct(res);
            console.log("Đây nè: ", res);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (detailProduct) {
            setIsModalOpen(true);
        }
    }, [detailProduct]);
    const toggleVisibility = async (productId) => {
        try {
            if (isVisible) {
                // Nếu sản phẩm đang hiển thị, gọi API disable
                await disableProduct(productId);
                toast.success("Ẩn sản phẩm thành công")
            } else {
                // Nếu sản phẩm đang ẩn, gọi API enable
                await enableProduct(productId);
                toast.success("Hiện sản phẩm thành công")
            }
            // Thay đổi trạng thái hiển thị sau khi gọi API thành công
            setIsVisible(!isVisible);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
            alert("Không thể thay đổi trạng thái sản phẩm");
        }
    };

    return (
        <div
            className={`flex items-center bg-white shadow-md rounded-lg border border-gray-300 w-[800px] mx-auto my-4 ${
                !isVisible ? "bg-gray-100 opacity-50" : ""
            }`} // Thêm màu nền khác và hiệu ứng mờ khi sản phẩm bị ẩn
        >
            {/* Hình ảnh sản phẩm */}
            <div className="flex-shrink-0">
                <img
                    src= {image}
                    alt={name}
                    className="w-32 h-32 object-cover rounded-l-lg"
                />
            </div>
            {/* Thông tin sản phẩm */}
            <div className="flex flex-col justify-between flex-1 p-5">
                <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                <p className="text-gray-600">
                    Giá: <span className="font-medium text-green-600">{price} {currency}</span>
                </p>
                <div className="text-yellow-500 flex items-center">
                    {Array.from({ length: 5 }, (_, index) => (
                        <span key={index}>
                            {index < Math.round(rating) ? "★" : "☆"}
                        </span>
                    ))}
                    <span className="ml-2 text-gray-500 text-sm">{rating} / 5</span>
                </div>
            </div>
            {/* Các nút hành động */}
            <div className="flex flex-col items-center space-y-3 p-4">
                <button
                    onClick={handleUpdate}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    Cập nhật
                </button>
                <UpdateProductModal
                    initData={detailProduct}
                    productId={productId}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
                <button
                    onClick={() => toggleVisibility(productId)}
                    className={`${
                        isVisible ? "bg-gray-500 hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"
                    } text-white py-1 px-3 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300`}
                >
                    {isVisible ? "Ẩn" : "Hiện"}
                </button>
            </div>
        </div>
    );
};

export default ProductTestItem;