import React, {useEffect, useState} from "react";
import {getProductForAdmin} from "../../fetchAPI/fetchProduct.jsx";
import ProductTest from "./ProductTest.jsx";


const ProductManagement = () => {
  const [selectProduct, setSelectProduct] = useState(null);
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);


  const loadProducts = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await getProductForAdmin(page);
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
        {listProduct.map((item, index) => (
            <div key={index} className='flex gap-2'>
              <ProductTest name={item.name} price={item.minPrice} image={item.img} rating={item.rating} status={item.status} productId={item.productId} setSelectProduct={setSelectProduct} shopName={item.shopName} />
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

      </div>
  );
};

export default ProductManagement;