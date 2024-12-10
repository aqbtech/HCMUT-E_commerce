import { useEffect, useState } from 'react';
import Content from '../components/homePage/Content';
import LatestProduct from '../components/homePage/LatestProduct';
import OurPolicy from '../components/homePage/OurPolicy';
import Category from '../components/homePage/Category';
import {  getProduct, getProductForSearch} from '../fetchAPI/fetchProduct';
import { getAllCategories } from '../fetchAPI/fetchCategory';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import  {searchProductByCate_DB} from "../fetchAPI/fetchDB.jsx";

const Home = () => {
  const [listProduct, setListProduct] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);


  // Hàm load sản phẩm phân trang
  const loadProducts = async (page) => {
    if(loading) return;
    setLoading(true);
    try {
      if (category.length === 0) {
        const response = await getProduct(page);
        setListProduct(response.content);
        setHasMore(page + 1 < response.page.totalPages);
      } else {
        // const body = {
        //   "categories" :  Array.isArray(category) ? category : [category],
        //   "locations": [],
        //   "ratings": []
        // }
        // const response = await getProductForSearch("", page, "", body, true);
        // setListProduct(response.productSummaryPage.content);
        // setHasMore(page + 1 < response.productSummaryPage.page.totalPages);
        const response = await searchProductByCate_DB(category);
        if(response.code !== 200) {
          return toast.error(response.message);
        }
        setListProduct(response.result);
        toast.success("Tìm Kiếm sản phẩm theo danh mục thành công");
        setHasMore(false);
      }
    } catch(err) {
      toast.error("lỗi khi lấy sản phẩm home_page")
    } finally {
      setLoading(false);
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
        {
          loading ?
              <div className="flex justify-center mt-32 h-screen">
                <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-4xl" />
              </div>
              :
              <LatestProduct data={listProduct} />
        }

        {(
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
        )}

        <OurPolicy />
      </div>
  );
};

export default Home;
