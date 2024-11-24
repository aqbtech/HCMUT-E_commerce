import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { fetchProductsWithFilters } from "../fetchAPI/fetchProduct";
import { assets } from "../assets/assets";

const Collection = () => {
  const {navigate} = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const [listProduct, setListProduct] = useState([]);
  const [availableFilters, setAvailableFilters] = useState({});
  const [sorting, setSorting] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    sort: "relevance",
    page: 0,
    size: 10,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { search } = useContext(ShopContext);

  // Fetch sản phẩm và bộ lọc
  const fetchProducts = async () => {
    if (!filters.keyword && !filters.category) {
      setErrorMessage("Không tìm thấy kết quả nào.");
      setListProduct([]);
      return;
    }

    try {
      const response = await fetchProductsWithFilters(filters);
      setListProduct(response.content || []);
      setAvailableFilters(response.filters.available || {});
      setSorting(response.sort_options.available || []);
      setErrorMessage(""); // Reset lỗi nếu có kết quả
    } catch (err) {
      console.error("Error fetching products:", err);
      setErrorMessage("Đã xảy ra lỗi khi tải sản phẩm.");
    }
  };

  // Cập nhật bộ lọc khi từ khóa hoặc danh mục thay đổi
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      keyword: keyword || "",
      category: category || "",
      page: 0,
    }));
  }, [keyword, category]);

  // Fetch khi bộ lọc thay đổi
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Cập nhật giá trị bộ lọc
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 0, // Reset về trang đầu
    }));
  };

  // Render từng bộ lọc dựa trên trường API trả về
  const renderFilters = () => {
    return Object.entries(availableFilters).map(([key, options]) => (
      <div key={key} className="mb-6">
        <p className="mb-3 text-sm font-medium">{key.toUpperCase()}</p>
        <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
          {options.map((option, index) => {
            const displayText =
              typeof option === "object"
                ? option.name || `${option.min || ""} - ${option.max || ""}` // Hiển thị dạng `min - max`
                : option;

            return (
              <label key={index} className="flex gap-2">
                <input
                  type="radio"
                  name={key}
                  value={JSON.stringify(option)}
                  onChange={() => handleFilterChange(key, option)}
                />
                {displayText}
              </label>
            );
          })}
        </div>
      </div>
    ));
  };

  return errorMessage ? (
    <div className="col-span-full flex flex-col items-center justify-center text-gray-500 min-h-[600px] space-y-6">
      <div className="flex flex-col items-center">
        <img
          src={assets.notFound} // Đường dẫn đến icon minh họa
          alt="Không tìm thấy sản phẩm"
          className="w-24 h-24"
        />
        <p className="text-lg font-medium mt-4">Không tìm thấy kết quả nào</p>
      </div>
      <button
        onClick={() => navigate(`/`)}
        className="px-6 py-3  text-grey text-sm rounded-md shadow-md hover:bg-black transition"
      >
        Quay về trang chủ
      </button>
    </div>

  
  ) : (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Bộ lọc */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter((prev) => !prev)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          BỘ LỌC
        </p>
        <div className={`border border-gray-300 pl-5 py-3 ${showFilter ? "" : "hidden"} sm:block`}>
          {renderFilters()}
        </div>
      </div>
  
      {/* Sản phẩm */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"SẢN"} text2={"PHẨM"} />
          <select
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            {sorting.map((sort) => (
              <option key={sort.id} value={sort.id}>
                {sort.name}
              </option>
            ))}
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
      </div>
    </div>
  );
}

export default Collection;
