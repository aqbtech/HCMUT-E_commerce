import React, {useEffect, useState} from "react";
import AddProductModal from "./AddProductModal";
import {getProduct, getProductOfSeller} from "../../fetchAPI/fetchProduct.jsx";
import ProductItem from "../ProductItem.jsx";
import ProductTestItem from "../ProductTestItem.jsx";


const ProductManagement = () => {
    const [selectProduct, setSelectProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listProduct, setListProduct] = useState([]);
    const [loading, setLoading] = useState(false); // Trạng thái loading khi gọi API
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const loadProducts = async () => {
        try {
            const response = await getProductOfSeller(page);
            setListProduct(response.content)
            setHasMore(listProduct.length + response.content.length < response.totalElements);
        } catch(err) {
            throw err;
        }
    };

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

            {listProduct.map((item, index) => (
            <div key={index} className='flex gap-2'>
                <ProductTestItem name={item.name} price={item.minPrice} image={item.img} rating={item.rating} status={item.status} productId={item.productId} setSelectProduct={setSelectProduct} />
            </div>
            ))}

            {hasMore && !loading && (
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
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ProductManagement;