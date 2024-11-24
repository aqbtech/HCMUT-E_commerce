import { useContext, useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { getProductForShopView } from "../fetchAPI/fetchProduct";
import { getInfoShopView } from "../fetchAPI/fetchShop";
import { toast } from "react-toastify";
import ErrorMessage from "/src/components/errorMessage";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ProductItem from "../components/ProductItem";

const ShopView = () => {
  const { shopId } = useParams();
  const { navigate, curState, systemError, setSystemError } = useContext(ShopContext);
  const [shopInfo, setShopInfo] = useState(null);
  const [listProduct, setListProduct] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("relevance");
  const [hasMore, setHasMore] = useState(true);

  const fetchInfo = async () => {
    setIsLoading(true);
    try {
      const response = await getInfoShopView(shopId);
    
      setShopInfo(response);
    } catch (err) {
      setSystemError(err.response?.data?.message || err.response?.data?.error || "Mất kết nối máy chủ");
    }
    setIsLoading(false);
  };

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await getProductForShopView(shopId, page, sortOption);
     
      const products = response.content;
      setListProduct((prev) => (page === 0 ? products : [...prev, ...products]));
      setHasMore(listProduct.length + response.content.length < response.totalElements);
    } catch (err) {
      console.log(err);
      setSystemError(err.response?.data?.message || err.response?.data?.error || "Mất kết nối máy chủ");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, [shopId]);

  useEffect(() => {
    fetchProduct();
  }, [page, shopId, sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(0); // Reset page to load sorted data from the beginning
  };

  const handleLoadMore = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        {/* Shop Info Section */}
        <div className="flex items-center space-x-4">
          <img
            src={shopInfo?.logo} // Chắc chắn rằng bạn có logo của shop
            alt="Shop Logo"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{shopInfo?.shopName}</h1>
            <p className="text-sm text-gray-500">{shopInfo?.status}</p>
            <p className="text-sm text-gray-500 mt-1">{shopInfo?.location}</p>
            {/* Mô tả ngắn về shop */}
            <p className="mt-2 text-sm text-gray-600 max-w-xs">{shopInfo?.description}</p>
          </div>
        </div>

        {/* Shop Stats Section */}
        <div className="flex space-x-6 text-sm text-gray-600 mt-4">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-800">{shopInfo?.numberOfProduct}</span>
            <span>Sản Phẩm</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-800">{shopInfo?.participateTime}</span>
            <span>Tham gia</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-800">{shopInfo?.rating}</span>
            <span>Đánh Giá</span>
          </div>
        </div>
      </div>



      {/* Sort Options */}
      <div className="flex justify-end mb-4">
        <select
          className="border px-3 py-2"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="relevance">Liên quan nhất</option>
          <option value="price_asc">Giá thấp đến cao</option>
          <option value="price_desc">Giá cao đến thấp</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {listProduct.length > 0 ? (
            listProduct.map((item) => (
              <ProductItem
                key={item.productId}
                id={item.productId}
                name={item.name}
                price={item.minPrice}
                image={item.img}
                rating={item.rating}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tải thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopView;
