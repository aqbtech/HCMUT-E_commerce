import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { fetchProductsWithFilters, getProductForSearch } from "../fetchAPI/fetchProduct";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const SearchPage = () => {
  const { navigate } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const [isFilter, setIsFilter] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("");
  const [availableFilters, setAvailableFilters] = useState({});
  const [filters, setFilters] = useState({
    categories: [],
    location: [],
    rating: [],
  });
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const listSorting = [
    { name: "Liên quan nhất", value: "" },
    { name: "Giá thấp đến cao", value: "asc" },
    { name: "Giá cao đến thấp", value: "desc" },
  ];

  const fetchProducts = async () => {
    try {
      console.log("Filter:", filters, isFilter)
      const response = await getProductForSearch(keyword, page, sort, filters, isFilter);
      setListProduct(response?.content || []);
      setAvailableFilters(response?.filters?.available || {});
      setTotalPages(response?.page?.totalPages || 0);
    } catch (err) {
      console.error("Error fetching products:", err);
      setErrorMessage("Đã xảy ra lỗi khi tải sản phẩm.");
    }
  };

  useEffect(() => {
    if(!keyword) {
      setErrorMessage("Không tìm thấy sản phẩm")
    } 
    fetchProducts();
  }, [filters, page, sort]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      const currentValues = updatedFilters[key] || [];

      if (currentValues.includes(value)) {
        updatedFilters[key] = currentValues.filter((item) => item !== value);
      } else {
        updatedFilters[key] = [...currentValues, value];
      }

    // Kiểm tra nếu bất kỳ bộ lọc nào còn giá trị
    const hasFilters = Object.values(updatedFilters).some(
      (filterValues) => filterValues.length > 0
    );
    setIsFilter(hasFilters); // Cập nhật trạng thái isFilter
      
      return updatedFilters;
    });
    setPage(0);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (errorMessage) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center text-gray-500 min-h-screen space-y-6">
        <div className="flex flex-col items-center">
          <img src={assets.notFound} alt="Không tìm thấy sản phẩm" className="w-24 h-24" />
          <p className="text-lg font-medium mt-4">{errorMessage}</p>
        </div>
        <button
          onClick={() => navigate(`/`)}
          className="px-6 py-3 text-grey text-sm rounded-md shadow-md hover:bg-black transition"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t min-h-screen">
      {/* Bộ lọc */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">BỘ LỌC</p>
        <div className="border border-gray-300 pl-5 py-3">
          {/* Location Filter */}
          <div className="mb-4">
            <p className="font-semibold">Địa Điểm</p>
            {availableFilters.location?.map((filterValue) => (
              <label key={filterValue} className="block">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={filters.location.includes(filterValue)}
                  onChange={() => handleFilterChange("location", filterValue)}
                />
                {filterValue}
              </label>
            ))}
          </div>

          {/* Categories Filter */}
          <div className="mb-4">
            <p className="font-semibold">Danh Mục</p>
            {availableFilters.categories?.map((filterValue) => (
              <label key={filterValue} className="block">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={filters.categories.includes(filterValue)}
                  onChange={() => handleFilterChange("categories", filterValue)}
                />
                {filterValue}
              </label>
            ))}
          </div>

          {/* Ratings Filter */}
          <div className="mb-4">
            <p className="font-semibold">Đánh Giá</p>
            {availableFilters.rating?.map((filterValue) => (
              <label key={filterValue} className="block">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={filters.rating.includes(filterValue)}
                  onChange={() => handleFilterChange("rating", filterValue)}
                />
                {filterValue}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"SẢN"} text2={"PHẨM"} />
          <select
            onChange={handleSortChange}
            value={sort}
            className="border-2 border-gray-300 text-sm px-2 rounded-lg"
          >
            {listSorting.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {listProduct.map((item) => (
            <ProductItem
              key={item.productId}
              id={item.productId}
              name={item.name}
              price={item.minPrice}
              image={item.img}
              rating={item.rating}
            />
          ))}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => handlePageChange(Math.max(page - 1, 0))}
              disabled={page === 0}
              className={`px-3 py-1 border rounded ${
                page === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white text-gray-800"
              }`}
            >
              Trang trước
            </button>
            <span className="px-4 py-1 border rounded bg-gray-100 text-gray-800">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(page + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className={`px-3 py-1 border rounded ${
                page === totalPages - 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white text-gray-800"
              }`}
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
