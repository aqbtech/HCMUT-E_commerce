import { useEffect, useState } from 'react';
import Content from '../components/homePage/Content';
import LatestProduct from '../components/homePage/LatestProduct';
import OurPolicy from '../components/homePage/OurPolicy';
import Category from '../components/homePage/Category';
import {  getProduct, getProductOfCategory} from '../fetchAPI/fetchProduct';
import { getAllCategories } from '../fetchAPI/fetchCategory';
import { toast } from 'react-toastify';

const Home = () => { 
  const [listProduct, setListProduct] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  
  // Hàm load sản phẩm phân trang
  const loadProducts = async (page) => {
    try {
      if (category.length === 0) {
        const response = await getProduct(page);
        setListProduct(page === 0 ? response.content : [...listProduct, ...response.content]);
        setHasMore(page + 1 < response.page.totalPages);
      } else {
        const response = await getProductOfCategory(category, page);
        setListProduct(page === 0 ? response.content : [...listProduct, ...response.content]);
        setHasMore(page + 1 < response.page.totalPages);
      }
    } catch(err) {
      toast.error("lỗi khi lấy sản phẩm home_page")
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setListCategories(response);
      } catch (err) {
        toast.error("Lỗi khi lấy danh mục sản phẩm");
      }
    };
  
    fetchCategories();
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    loadProducts(page); 
  }, [page, category]);

  // Hàm xử lý khi chọn danh mục
  const handleCategorySelect = (newCategory) => {
    setCategory(newCategory);
    setPage(0); // Đặt lại page về 0 khi thay đổi danh mục
  };

  // Chuyển sang trang tiếp theo
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  // Quay lại trang trước
  const handlePreviousPage = () => {
    if (page > 0) {
    setPage((prev) => prev - 1)}
  };

  return (
    <div>
      <Content />
      <Category 
        data={listCategories || []} 
        onCategorySelect={handleCategorySelect} 
      />
      <LatestProduct data={listProduct} />
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Trang Trước
        </button>
        <p>{page + 1}</p>
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Trang Tiếp
        </button>
      </div>
      <OurPolicy />
    </div>
  );
};

export default Home;
