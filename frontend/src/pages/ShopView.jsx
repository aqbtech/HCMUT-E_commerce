import { useContext, useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { getProductForShop } from "../fetchAPI/fetchProduct";
import { getInfo, follow, unfollow } from "../fetchAPI/fetchShop";
import { toast } from "react-toastify";
import { assets } from '../assets/assets.js';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ProductItem from "../components/ProductItem";
import Cookies from 'js-cookie'
import {shopInfo_DB} from "../fetchAPI/fetchDB.jsx";

const ShopView = () => {
  const { shopId } = useParams();
  const { navigate } = useContext(ShopContext);
  const [shopInfo, setShopInfo] = useState(null);
  const [listProduct, setListProduct] = useState([]);
  const [ListCategories, setListCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProducts, setLoadingProduct] = useState(true)
  const [sort, setSort] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const listSorting = [
    { name: "Liên quan nhất", value: "" },
    { name: "Giá thấp đến cao", value: "asc" },
    { name: "Giá cao đến thấp", value: "desc" },
  ];

  const fetchInfo = async () => {
    setIsLoading(true);
    try {
      // const response = await getInfo(shopId);
      const response = await shopInfo_DB(shopId);
      if(response.code === 400) {
        return toast.error(response.message);
      }
      toast.success("Lấy thông tin shop thành công!")
      setShopInfo(response.result);
    } catch (err) {
      toast.error("Lỗi khi lấy sản phẩm của shop");
    }
    setIsLoading(false);
  };

  const fetchProduct = async () => {
    setLoadingProduct(true);
    try {
      const response = await getProductForShop(shopId, page, selectedCategory, sort );
      const products = response.productSummaryPage.content;
      setListCategories(response.categories)
      setListProduct((prev) => (page === 0 ? products : [...prev, ...products]));
      setHasMore(page + 1 < response.productSummaryPage.page.totalPages);
    } catch (err) {
      console.log(err);
    }
    setLoadingProduct(false);
  };

  useEffect(() => {
    fetchInfo();
  }, [shopId]);

  useEffect(() => {
    fetchProduct();
  }, [page, shopId, sort, selectedCategory]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(0);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Cập nhật danh mục được chọn
    setPage(0); // Reset lại trang về 0
  };

  const handleFollow = async () => {
    if (!Cookies.get("username")) {
      const currentTab = location.search; // Lấy query parameter hiện tại (vd: ?tab=profile)
      return navigate("/Login", { state: { from: location.pathname + currentTab } });
    }

    if (shopInfo?.followed) {
      try {
        await unfollow(shopId);  // Gọi API để hủy theo dõi
        setShopInfo((prev) => ({ ...prev, followed: false, followers: prev.followers - 1}));  // Cập nhật lại trạng thái
        toast.success("Hủy theo dõi thành công");
      } catch (err) {
        toast.error("Có lỗi xảy ra khi hủy theo dõi");
      }
    } else {
      try {
        await follow(shopId);  // Gọi API để theo dõi
        setShopInfo((prev) => ({ ...prev, followed: true, followers: prev.followers + 1 }));  // Cập nhật lại trạng thái
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
  return (
      <div className="container min-h-screen mx-auto py-8">
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
                      shopInfo?.followed
                          ? "text-white bg-red-500 hover:bg-red-600 focus:ring-red-400"  // Đã theo dõi
                          : "text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-400" // Chưa theo dõi
                  }`}
                  onClick={ () => handleFollow()}
              >
                {shopInfo?.followed ? "Hủy theo dõi" : "Theo dõi"}
              </button>

            </div>

            {/* Thông tin Shop */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{shopInfo?.shopName}</h1>
              <p className="text-sm text-gray-500">{shopInfo?.status}</p>
              <p className="text-sm text-gray-500 mt-1">{shopInfo?.address}</p>
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
              <span className="font-semibold text-gray-800">{shopInfo?.rating.toFixed(1)}/5</span>
              <span>Đánh Giá</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 mt-4">
          {/* Sort Option */}
          <select
              className="border px-3 py-2 rounded-lg w-40"
              value={selectedCategory}
              onChange={handleCategoryChange}
          >
            <option value="">Tất cả danh mục</option>
            {ListCategories.map((category) => (
                <option key={category.value} value={category}>
                  {category}
                </option>
            ))}
          </select>

          {/* Sort Price */}
          <select
              onChange={handleSortChange}
              value={sort}
              className="border px-3 py-2 rounded-lg w-40"
          >
            {listSorting.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
            ))}
          </select>
        </div>

        {
          loadingProducts ?
              (<div className="flex justify-center mt-24 min-h-screen">
                <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
              </div>)
              :
              (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {listProduct.length > 0 ? (
                    listProduct.map((item) => (
                        <ProductItem
                            key={item.productId}
                            id={item.productId}
                            name={item.name}
                            price={item.minPrice}
                            image={item.img}
                            rating={item.rating}
                            sale={item.sale}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
                )}
              </div>)
        }

        {/* Load More Button */}
        {hasMore && (
            <div className="text-center mt-8">
              <button
                  onClick={handleLoadMore}
                  className="border-2 border-gray-300  px-4 py-2 font-medium hover:bg-gray-300"
              >
                Xem thêm
              </button>
            </div>
        )}
      </div>
  );
};

export default ShopView;
