import { useContext, useEffect, useState } from 'react';
import Content from '../components/homePage/Content';
import LatestProduct from '../components/homePage/LatestProduct';
import BestSeller from '../components/homePage/BestSeller';
import OurPolicy from '../components/homePage/OurPolicy';
import Category from '../components/homePage/Category';
import { getAllProducts } from '../fetchAPI/fetchProduct';
import { getCategories } from '../fetchAPI/fetchCategory';
import SearchBar from '../components/global/SearchBar';
import { ShopContext } from '../context/ShopContext';
import ErrorMessage from '/src/components/errorMessage';

const Home = () => { 
  const { systemError, setSystemError } = useContext(ShopContext);
  const [listProduct, setListProduct] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  
  // Hàm load sản phẩm với các tham số lọc và phân trang
  const loadProducts = (category, subCategory, page = 1, limit = 10) => {
    const categoryFilter = category ? `&categories=${category}` : '';
    const subCategoryFilter = subCategory ? `&subCategory=${subCategory}` : '';
    const apiUrl = `?page=${page}&prevPage=${prevPage}&limit=${limit}${categoryFilter}${subCategoryFilter}`;

    getAllProducts(apiUrl)
      .then((res) => setListProduct(res))
      .catch((err) => {
        setSystemError(err.response?.data?.message || err.response?.data?.error || "Mất kết nối máy chủ");
      });
  };

  // Load sản phẩm khi trang và các bộ lọc thay đổi
  useEffect(() => {
    loadProducts(selectedCategory, selectedSubCategory, page);
  }, [selectedCategory, selectedSubCategory, page]);

  // Load danh mục khi trang được mở
  useEffect(() => {
    getCategories()
      .then((res) => setListCategories(res))
      .catch((err) => setSystemError(err.response?.data?.message || "Lỗi khi tải danh mục"));
  }, []);

  // Hàm xử lý khi chọn danh mục
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubCategory(null);
    setPage(1); // Reset trang khi thay đổi danh mục
  };

  // Hàm xử lý khi chọn danh mục con
  const handleSubCategorySelect = (subCategoryName) => {
    setSelectedSubCategory(subCategoryName);
    setPage(1); // Reset trang khi thay đổi danh mục con
  };

  // Chuyển sang trang tiếp theo
  const handleNextPage = () => {
  setPrevPage(page);
    setPage((prev) => prev + 1);
  };

  // Quay lại trang trước
  const handlePreviousPage = () => {
    if (page > 1) {
    setPrevPage(page);
    setPage((prev) => prev - 1)}
  };

  if (systemError) {
    return <ErrorMessage message={systemError} />;
  }

  return (
    <div>
      <SearchBar />
      <Content />
      <Category 
        data={listCategories} 
        onCategorySelect={handleCategorySelect} 
        onSubCategorySelect={handleSubCategorySelect} 
        selectedCategory={selectedCategory}
      />
      <LatestProduct data={listProduct} />
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Trang Trước
        </button>
        <p>{page}</p>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
        >
          Trang Tiếp
        </button>
      </div>
      <OurPolicy />
    </div>
  );
};

export default Home;
