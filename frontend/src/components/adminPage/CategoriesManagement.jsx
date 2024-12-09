import { useEffect, useState } from "react";
import { deleteCategory, getCategoriesForAdmin, updateCategory, createCategory } from "../../fetchAPI/fetchCategory";
import { toast } from "react-toastify";
import Title from "../Title";

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0); 
    const [modalMode, setModalMode] = useState(""); 
    const [modalCategory, setModalCategory] = useState(null);
    const [categoryName, setCategoryName] = useState("");

    const fetchCategories = async (currentPage) => {
        try {
            const res = await getCategoriesForAdmin(currentPage);
            setCategories(res.content);
            setTotalPages(res.page.totalPages); // Cập nhật tổng số trang
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi lấy danh mục");
        }
    };

    useEffect(() => {
        fetchCategories(page);
    }, [page]);

    const handleDelete = async (id) => {
        try {
            const res = await deleteCategory(id);
            if (res.code === 200) {
                const updatedCategories = await getCategoriesForAdmin(page);
                setCategories(updatedCategories.content)
                setTotalPages(updatedCategories.page.totalPages); // Cập nhật tổng số trang
                toast.success("Xóa danh mục thành công");
            }
        } catch (err) {
            toast.error("Lỗi khi xóa danh mục");
        }
    };

    const openModal = (mode, category = null) => {
        setModalMode(mode);
        setModalCategory(category);
        setCategoryName(category ? category.richTextName : "");
    };

    const handleSave = async () => {
        if (!categoryName) {
            toast.error("Tên danh mục không được để trống!");
            return;
        }

        const body = { richTextName: categoryName };

        if (modalMode === "add") {
            try {
                const res = await createCategory(body);
                if (res.code === 200) {
                    const updatedCategories = await getCategoriesForAdmin(page);
                    setCategories(updatedCategories.content)
                    setTotalPages(updatedCategories.page.totalPages); // Cập nhật tổng số trang
                    toast.success("Thêm danh mục thành công");
                }
            } catch (err) {
                console.log(err);
                toast.error("Lỗi khi thêm danh mục!");
            }
        } else if (modalMode === "edit") {
            try {
                const res = await updateCategory(body, modalCategory.id);
                if (res.code === 200) {
                    setCategories((prev) =>
                        prev.map((category) =>
                            category.id === modalCategory.id
                                ? { ...category, richTextName: categoryName }
                                : category
                        )
                    );
                    toast.success("Cập nhật danh mục thành công");
                }
            } catch (err) {
                toast.error("Lỗi khi cập nhật danh mục!");
            }
        }

        setModalMode("");
        setModalCategory(null);
        setCategoryName("");
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                <Title text1="Quản Lý" text2="Danh Mục" />
            </h2>

            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => openModal("add")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                    Thêm danh mục
                </button>
            </div>

            <table className="w-full border-collapse border text-gray-700">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-200 p-3 text-left">ID</th>
                        <th className="border border-gray-200 p-3 text-left">Danh Mục</th>
                        <th className="border border-gray-200 p-3 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 p-3">{category.id}</td>
                            <td className="border border-gray-200 p-3">{category.richTextName}</td>
                            <td className="border border-gray-200 p-3 space-x-2">
                                <button
                                    onClick={() => openModal("edit", category)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {(
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className={`px-4 py-2 border-2 rounded-lg ${page === 0 ? "border-gray-300 text-gray-400" : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"}`}
                    >
                        Trang trước
                    </button>
                    <p className="text-center text-gray-700 font-medium">
                        {page + 1} / {totalPages}
                    </p>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={page === totalPages - 1}
                        className={`px-4 py-2 border-2 rounded-lg ${page === totalPages - 1 ? "border-gray-300 text-gray-400" : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"}`}
                    >
                        Trang sau
                    </button>
                </div>
            )}
            

            {/* Shared Modal */}
            {modalMode && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-xl font-bold mb-4">
                            {modalMode === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Tên danh mục</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setModalMode("");
                                    setModalCategory(null);
                                    setCategoryName("");
                                }}
                                className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                                {modalMode === "add" ? "Thêm" : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesManagement;