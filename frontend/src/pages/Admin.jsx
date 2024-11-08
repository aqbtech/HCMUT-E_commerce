// AdminPage.js
import { useState } from "react";
import UserManagement from "../components/adminPage/UserManagement";
import ProductManagement from "../components/adminPage/ProductManagement";
import Title from "../components/Title";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("Users");

  return (
    <div className="flex ">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Admin</h2>
        <ul>
          <li
            className={`cursor-pointer py-2 ${activeTab === "Users" ? "text-orange-600 font-bold" : ""}`}
            onClick={() => setActiveTab("Users")}
          >
            Quản Lý Người Dùng
          </li>
          <li
            className={`cursor-pointer py-2 ${activeTab === "products" ? "text-orange-600 font-bold" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Quản Lý Sản Phẩm
          </li>
          <li
            className={`cursor-pointer py-2 ${activeTab === "saleOff" ? "text-orange-600 font-bold" : ""}`}
            onClick={() => setActiveTab("saleOff")}
          >
            Quản lý chính sách
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {activeTab === "Users" && <UserManagement />}
        {activeTab === "products" && <ProductManagement />}

      </div>
    </div>
  );
};

export default AdminPage;
