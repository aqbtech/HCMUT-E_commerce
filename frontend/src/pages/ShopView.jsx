import { useContext, useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { getProductForShopView } from "../fetchAPI/fetchProduct";
import { getInfoShopView, getInfo, follow, unfollow } from "../fetchAPI/fetchShop";
import { toast } from "react-toastify";
import ErrorMessage from "/src/components/errorMessage";
import { assets } from '../../src/assets/assets';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ProductItem from "../components/ProductItem";
import Cookies from 'js-cookie'

const ShopView = () => {
  const { shopId } = useParams();
  const { navigate, systemError, setSystemError } = useContext(ShopContext);
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
    setPage(0);
  };

  const handleFollow = async (shopId) => {
    if (!Cookies.get("username")) {
      const currentTab = location.search; // Lấy query parameter hiện tại (vd: ?tab=profile)
      return navigate("/Login", { state: { from: location.pathname + currentTab } });
    }
  
    if (shopInfo?.isFollowed) {
      try {
        await unfollow(shopId);  // Gọi API để hủy theo dõi
        setShopInfo((prev) => ({ ...prev, isFollowed: false }));  // Cập nhật lại trạng thái
        toast.success("Hủy theo dõi thành công");
      } catch (err) {
        toast.error("Có lỗi xảy ra khi hủy theo dõi");
      }
    } else {
      try {
        await follow(shopId);  // Gọi API để theo dõi
        setShopInfo((prev) => ({ ...prev, isFollowed: true }));  // Cập nhật lại trạng thái
        toast.success("Theo dõi thành công");
      } catch (err) {
        toast.error("Có lỗi xảy ra khi theo dõi");
      }
    }
  }

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
  if (systemError) {
    return <ErrorMessage message={systemError} />;
  }
  return (
    <div className="container mx-auto py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        {/* Shop Info Section */}
        <div className="flex items-center space-x-4">
          {/* Logo Shop */}
          <div className="flex flex-col items-center">
            <img
              src={assets.store} 
              alt="Shop Logo"
              className="w-16 h-16 rounded-full"
            />
            {/* Nút Theo Dõi */}
            <button
              className={`mt-2 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 
                ${
                  shopInfo?.isFollowed 
                    ? "text-white bg-red-500 hover:bg-red-600 focus:ring-red-400"  // Đã theo dõi
                    : "text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-400" // Chưa theo dõi
                }`}
              onClick={ () => handleFollow()}
            >
              {shopInfo?.isFollowed ? "Hủy theo dõi" : "Theo dõi"}
            </button>

          </div>

          {/* Thông tin Shop */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{shopInfo?.shopName}</h1>
            <p className="text-sm text-gray-500">{shopInfo?.status}</p>
            <p className="text-sm text-gray-500 mt-1">{shopInfo?.location}</p>
          </div>
        </div>


        {/* Shop Stats Section */}
        <div className="flex space-x-6 text-sm text-gray-600 mt-4">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-800">{shopInfo?.numberOfProduct}</span>
            <span>Sản Phẩm</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-800">{shopInfo?.followers}</span>
            <span>Người Theo Dõi</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-800">{shopInfo?.rating}/5</span>
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
