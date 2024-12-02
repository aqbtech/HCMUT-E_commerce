import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {getAllCategory} from "../../fetchAPI/fetchCategory.jsx";
import {createProduct, updateProduct} from "../../fetchAPI/fetchProduct.jsx";
import {toast} from "react-toastify";

const UpdateProductModal = ({isOpen, onClose, initData, productId}) => {
    const [formData, setFormData] = useState({
        username: Cookies.get('username'),
        name: "",
        productId: "",
        description: "",
        category: "",
        attributes: [],
        productInstances: [
            { attributeValues: [""], price: "", quantityInStock: "" },
        ],
    });

    useEffect(() => {
        if (initData) {
            setFormData({
                username: Cookies.get('username'),
                // eslint-disable-next-line react/prop-types
                name: initData?.name,
                productId: productId,
                // eslint-disable-next-line react/prop-types
                description: initData?.description,
                // eslint-disable-next-line react/prop-types
                category: initData?.category,
                // eslint-disable-next-line react/prop-types
                attributes: initData?.attributes,
                // eslint-disable-next-line react/prop-types
                productInstances: initData?.productInstances
            });
        }
    }, [initData]);
    const [categories, setCategories] = useState([]);  // Lưu danh sách categories


    useEffect(() => {
        // Gọi API để lấy danh sách categories
        const fetchCategories = async () => {
            try {
                const response = await getAllCategory();
                setCategories(response);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []); // Hàm này sẽ chạy 1 lần khi component được mount


    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const handleArrayChange = (field, index, value, type, valueIndex) => {
        const updatedFormData = { ...formData };

        if (field === "productInstances") {
            const updatedInstances = [...updatedFormData.productInstances];

            if (type === "quantityInStock") {
                // Cập nhật quantityInStock cho product instance
                updatedInstances[index].quantityInStock = value;
            } else if (type === "price") {
                // Cập nhật giá tiền cho product instance
                updatedInstances[index].price = value;
            }

            updatedFormData.productInstances = updatedInstances;
        } else if (field === "attributes") {
            const updatedAttributes = [...updatedFormData.attributes];

            if (type === "name") {
                updatedAttributes[index].name = value;
            } else if (type === "values") {
                const values = updatedAttributes[index].values;

                if (valueIndex < values.length) {
                    values[valueIndex] = value;
                } else {
                    values.push(value);
                }
            }

            updatedFormData.attributes = updatedAttributes;
        }

        setFormData(updatedFormData);
    };


    const handleNestedArrayChange = (fieldName, instanceIndex, attrIndex, newValue) => {
        const updatedProductInstances = [...formData.productInstances];
        updatedProductInstances[instanceIndex] = {
            ...updatedProductInstances[instanceIndex],
            attributeValues: [
                ...updatedProductInstances[instanceIndex].attributeValues.slice(0, attrIndex),
                newValue,
                ...updatedProductInstances[instanceIndex].attributeValues.slice(attrIndex + 1)
            ]
        };
        setFormData({
            ...formData,
            productInstances: updatedProductInstances
        });
    };

    // Thêm phần tử mới vào mảng


    const handleCreateProduct = async () => {
        for(let i = 0; i < formData.productInstances.length; i++){
            if(formData.productInstances[i].price === "" ){
                toast.error("Vui lòng nhập giá tiền cho sản phẩm");
                return;
            }
            if(formData.productInstances[i].quantityInStock === "" ) {
                toast.error("Vui lòng nhập số lượng cho sản phẩm");
                return;
            }
        }

        try {
            console.log(formData);
            await updateProduct(formData);
            toast.success("Cập nhật sản phẩm thành công");
            onClose();
            setFormData({
                username: Cookies.get('username'),
                name: "",
                description: "",
                category: "",
                attributes: [],
                productInstances: [
                    { attributeValues: [""], price: "", quantityInStock: "" },
                ],
            })

        } catch (err){
            toast.error("Lỗi khi tạo sản phẩm")
        }
    }
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-6 flex justify-center items-center w-full">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-7xl h-[90vh] overflow-y-auto">
                    <div className="relative">
                        <button
                            className="absolute right-4 text-red-500 text-5xl font-bold"
                            onClick={onClose}
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Chi tiết sản phẩm</h2>

                        {/* Product Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                            <input
                                type="text"
                                className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-800"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                            <input
                                type="text"
                                className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-800"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                            />
                        </div>


                        {/* Category */}
                        <div>
                            <label className="mb-4">
                                Danh mục
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange("category", e.target.value)}  // Sửa lại handleChange để cập nhật category
                                className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-800"
                            >
                                <option value="" disabled></option>
                                {/* Lặp qua các category để hiển thị */}
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Attributes */}
                        <div className="mt-4">
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Thuộc tính</label> */}
                            {formData.attributes.map((attribute, attrIndex) => (
                                <div key={attrIndex} className="border border-gray-300 p-4 rounded-md mb-4 relative">
                                    {/* Nút xóa thuộc tính ở góc phải */}
                                    <div className="mt-4 mb-2">
                                        <input
                                            type="text"
                                            className="w-full border-2 border-gray-300 rounded-md shadow-sm bg-gray-200 text-gray-800 cursor-not-allowed font-semibold"
                                            value={attribute.name}
                                            placeholder="Tên thuộc tính"
                                            disabled
                                            onChange={(e) =>
                                                handleArrayChange("attributes", attrIndex, e.target.value, "name")
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {attribute.values.map((value, valueIndex) => (
                                            <div key={valueIndex} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    className="w-full border-2 border-gray-300 rounded-md shadow-sm bg-gray-200 text-gray-800 cursor-not-allowed font-semibold"
                                                    value={value}
                                                    placeholder="Giá trị thuộc tính"
                                                    disabled
                                                    onChange={(e) =>
                                                        handleArrayChange("attributes", attrIndex, e.target.value, "values", valueIndex)
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* Product Instances */}
                        <div className="mb-6 mt-6">
                            {formData.productInstances.map((instance, instanceIndex) => (
                                <div
                                    key={instanceIndex}
                                    className="mb-4 border border-gray-300 p-4 rounded-md relative"
                                >
                                    {/* Attribute Values */}
                                    <div>
                                        <div className="flex flex-col gap-2">
                                            {formData.attributes.map((attribute, attrIndex) => (
                                                <div key={attrIndex} className="mb-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        {attribute.name || `Thuộc tính ${attrIndex + 1}`}
                                                    </label>
                                                    <select
                                                        value={formData.productInstances[instanceIndex].attributeValues[attrIndex] || ""}
                                                        onChange={(e) =>
                                                            handleNestedArrayChange(
                                                                "productInstances",
                                                                instanceIndex,
                                                                attrIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border-2 border-gray-300 rounded-md shadow-sm bg-gray-200 text-gray-800 cursor-not-allowed font-semibold"
                                                        disabled
                                                    >
                                                        <option value="" disabled>
                                                        </option>
                                                        {attribute.values.map((value, valueIndex) => (
                                                            <option key={valueIndex} value={value}>
                                                                {value}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Giá tiền
                                        </label>
                                        <input
                                            type="number"
                                            className={`w-full border-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-800`}
                                            value={instance.price}
                                            onChange={(e) => {
                                                const value = Math.max(1, (e.target.value));
                                                handleArrayChange(
                                                    "productInstances",
                                                    instanceIndex,
                                                    value,
                                                    "price"
                                                )
                                            }}
                                        />
                                    </div>


                                    {/* Quantity */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số lượng
                                        </label>
                                        <input
                                            type="number"
                                            className={`w-full border-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-800`}
                                            value={instance.quantityInStock}
                                            onChange={(e) => {
                                                const value = Math.max(1, (e.target.value));
                                                handleArrayChange(
                                                    "productInstances",
                                                    instanceIndex,
                                                    value,
                                                    "quantityInStock"
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                                onClick={handleCreateProduct}
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
        ;
};

export default UpdateProductModal;




