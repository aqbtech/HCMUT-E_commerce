import { useEffect, useState } from "react";
import { deleteCategory, getCategoriesForAdmin } from "../../fetchAPI/fetchCategory";
import { toast } from "react-toastify";

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [newChildCategory, setNewChildCategory] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategoriesForAdmin(page);
                console.log(res); // Kiểm tra dữ liệu trả về từ API
                setCategories(res.content);
                setHasMore(res.page.totalPages > page + 1);
            } catch (error) {
                console.error(error); // Ghi log lỗi nếu có
                toast.error("Lỗi khi lấy danh mục");
            }
        };
    
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            setCategories((prev) => prev.filter((category) => category.id !== id));
            toast.success("Xóa danh mục thành công");
        } catch {
            toast.error("Lỗi khi xóa danh mục");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setEditedName(category.richTextName);
    };

    const handleSaveEdit = () => {
        setCategories((prev) =>
            prev.map((category) =>
                category.id === editingCategory.id
                    ? { ...category, richTextName: editedName }
                    : category
            )
        );
        toast.success("Cập nhật danh mục thành công");
        setEditingCategory(null);
        setEditedName("");
    };

    const handleAddChildCategory = () => {
        if (!newChildCategory.trim()) {
            toast.error("Tên danh mục con không được để trống");
            return;
        }
        setCategories((prev) =>
            prev.map((category) =>
                category.id === editingCategory.id
                    ? {
                          ...category,
                          children: [...category.children, { id: Date.now(), richTextName: newChildCategory }],
                      }
                    : category
            )
        );
        setNewChildCategory("");
        toast.success("Thêm danh mục con thành công");
    };

    return (
        <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-6">Danh mục sản phẩm</h2>
            <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
                <table className="w-full border-collapse border border-gray-200 text-gray-700">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 p-3 text-left">ID</th>
                            <th className="border border-gray-200 p-3 text-left">Category Name</th>
                            <th className="border border-gray-200 p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 p-3">{category.id}</td>
                                <td className="border border-gray-200 p-3">{category.richTextName}</td>
                                <td className="border border-gray-200 p-3 space-x-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {editingCategory && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-xl font-bold mb-4">Edit Category</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Category Name</label>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Add Child Category</label>
                            <input
                                type="text"
                                value={newChildCategory}
                                onChange={(e) => setNewChildCategory(e.target.value)}
                                placeholder="Enter child category name"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <button
                                onClick={handleAddChildCategory}
                                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                            >
                                Add Child
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setEditingCategory(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesManagement;
