import { useContext, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const ProductManagement = () => {
  const { products, setProducts } = useContext(ShopContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const updateProductStatus = async (productId, status) => {
    try {
      await axios.patch(`http://localhost:3000/products/${productId}`, { status });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const toggleProductStatus = (productId, status) => {
    setProducts(products.map((product) => (product.id === productId ? { ...product, status } : product)));
    updateProductStatus(productId, status);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        <Title text1="Quản Lý" text2="Sản Phẩm" />
      </h2>
      <table className="w-full border border-gray-300">
        {/* Table Headers */}
        <thead>
          <tr>
            <th className="p-2 border-b text-left">ID</th>
            <th className="p-2 border-b text-left">Tên Sản Phẩm</th>
            <th className="p-2 border-b text-left">Giá</th>
            <th className="p-2 border-b text-left">Người Bán</th>
            <th className="p-2 border-b text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product) => (
            <tr key={product.id}>
              <td className="p-2 border-b">{product.id}</td>
              <td className="p-2 border-b">{product.name}</td>
              <td className="p-2 border-b">{product.price.toLocaleString()}.000₫</td>
              <td className="p-2 border-b">{product.seller}</td>
              <td className="p-2 border-b">
                <button
                  className={`px-4 py-2 rounded ${product.status ? "bg-gray-400" : "bg-red-400"} hover:bg-black hover:text-white`}
                  onClick={() => toggleProductStatus(product.id, product.status ? 0 : 1)}
                >
                  {product.status ? "Chặn" : "Gỡ Chặn"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default ProductManagement;
