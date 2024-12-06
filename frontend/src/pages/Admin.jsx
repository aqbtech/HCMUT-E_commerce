// AdminPage.js
import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import UserManagement from "../components/adminPage/UserManagement";
import ProductManagement from "../components/adminPage/ProductManagement";
import { ShopContext } from '../context/ShopContext';
import Cookies  from 'js-cookie';
import CategoriesManagement from '../components/adminPage/CategoriesManagement';

const AdminPage = () => {
  const { navigate } = useContext(ShopContext); 
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation(); // Để lấy đường dẫn hiện tại


  const initialTab = searchParams.get('tab') || 'Users'; 
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'Users';
    setActiveTab(tab);

    // Kiểm tra cookie
    if (!Cookies.get("username")) {
        const currentTab = location.search;
        navigate('/Login', { state: { from: location.pathname + currentTab } });
    }
  }, [searchParams, location]);


  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab }); 
  };

  return (
    <div className="flex min-h-screen border-t pt-16">
      {/* Sidebar */}
      <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold mb-4">Quản trị viên</h2>
        <ul>
          <li
            className={`cursor-pointer py-2 ${
              activeTab === "Users" ? "text-orange-600 font-bold" : ""
            }`}
            onClick={() => handleTabChange("Users")}
          >
            Quản Lý Người Dùng
          </li>
          <li
            className={`cursor-pointer py-2 ${
              activeTab === "products" ? "text-orange-600 font-bold" : ""
            }`}
            onClick={() => handleTabChange("products")}
          >
            Quản Lý Sản Phẩm
          </li>
          <li
            className={`cursor-pointer py-2 ${
              activeTab === "saleOff" ? "text-orange-600 font-bold" : ""
            }`}
            onClick={() => handleTabChange("saleOff")}
          >
            Quản lý chính sách
          </li>
          <li
            className={`cursor-pointer py-2 ${
              activeTab === "categories" ? "text-orange-600 font-bold" : ""
            }`}
            onClick={() => handleTabChange("categories")}
          >
            Quản lý danh mục
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6 bg-white">
        {activeTab === "Users" && <UserManagement />}
        {activeTab === "products" && <ProductManagement />}
        {activeTab === "categories" && <CategoriesManagement />}
      </div>
    </div>
  );
};

export default AdminPage;
