import React, {useEffect, useState} from "react";
import AddProductModal from "./AddProductModal";
import {getProduct, getProductOfSeller} from "../../fetchAPI/fetchProduct.jsx";
import ProductItem from "../ProductItem.jsx";
import ProductTestItem from "../ProductTestItem.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const ProductManagement = () => {
    const [selectProduct, setSelectProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listProduct, setListProduct] = useState([]);
    const [loading, setLoading] = useState(false); // Trạng thái loading khi gọi API
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);


    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await getProductOfSeller(page);
            if(page === 0) {
                setListProduct(response.content)
                setHasMore(page + 1 < response.page.totalPages);
            } else {
                setListProduct((prevData ) => {
                    const newData = response.content.filter(
                        (newItem) =>
                            !prevData.some((prevItem) => prevItem.productId === newItem.productId)
                    );
                    return [...prevData, ...newData]
                });
            }
            setHasMore(page + 1 < response.page.totalPages);
        } catch(err) {
            console.log("Lỗi khi lấy sản phẩm")
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = async () => {
       loadProducts();
       setIsModalOpen(false);
    }

    useEffect(() => {
        loadProducts(page);
    }, [page]);

    const handleLoadmore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };
    return (
        <div className="p-4">

            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    Thêm sản phẩm
                </button>
            </div>

            {
                loading ? (
                    <div className="flex justify-center mt-32 h-screen">
                        <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
                    </div>
                ) : listProduct.length === 0 ? (
                    // Hiển thị thông báo khi không có sản phẩm
                    <div className="flex justify-center mt-32 h-screen">
                        <p className="text-gray-500 text-lg">Không có sản phẩm nào!</p>
                    </div>
                ) : (
                    listProduct.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <ProductTestItem
                                name={item.name}
                                price={item.minPrice}
                                image={item.img}
                                rating={item.rating}
                                status={item.status}
                                productId={item.productId}
                            />
                        </div>
                    ))
                )
            }


            {hasMore && (
                <div className="text-center mt-6">
                    <button
                        onClick={handleLoadmore}
                        className="px-6 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Xem thêm
                    </button>
                </div>
            )}


            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => handleModalClose()}
            />
        </div>
    );
};

export default ProductManagement;