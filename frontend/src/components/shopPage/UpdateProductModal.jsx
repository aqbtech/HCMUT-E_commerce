import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {getAllCategory} from "../../fetchAPI/fetchCategory.jsx";
import {updateProduct, uploadIMG} from "../../fetchAPI/fetchProduct.jsx";
import {toast} from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaTag, FaInfo, FaImages, FaListUl, FaDollarSign, FaBoxes, FaTimes, FaPlus } from "react-icons/fa";
import { BsFillTrashFill } from "react-icons/bs";

const UpdateProductModal = ({isOpen, onClose, initData, productId}) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
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
    const [categories, setCategories] = useState([]);


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

    const handleImageUpload = async (files) => {
        const newImages = Array.from(files);
        const resizedImages = [];
    
        for (let file of newImages) {
            // Resize từng ảnh trước khi thêm vào state
            const resizedImage = await resizeImage(file, 390, 450);
            resizedImages.push(resizedImage);
        }
    
        // Thêm ảnh đã resize vào mảng ảnh cũ
        setImages((prev) => [...prev, ...resizedImages]);
    };
            
    const resizeImage = (file, width, height) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const reader = new FileReader();
    
          reader.onloadend = () => {
            img.src = reader.result;
          };
    
          img.onload = () => {
            // Tạo canvas để resize ảnh
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
    
            // Thiết lập kích thước của canvas theo kích thước mới
            canvas.width = width;
            canvas.height = height;
    
            // Vẽ ảnh vào canvas với kích thước mới
            ctx.drawImage(img, 0, 0, width, height);
    
            // Lấy dữ liệu ảnh đã resize và trả về dưới dạng base64
            canvas.toBlob((blob) => {
              const resizedFile = new File([blob], file.name, { type: file.type });
              resolve(resizedFile);
            });
          };
    
          img.onerror = (error) => {
            reject(error);
          };
    
          reader.readAsDataURL(file);
        });
      };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const handleCreateProduct = async () => {
        if(!formData.name) return toast.error("Vui lòng nhập tên sản phẩm")

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

        setLoading(true);
        try {
            console.log(formData);
            await updateProduct(formData);
            toast.success("Cập nhật sản phẩm thành công");

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
            onClose();
            setImages([])
        } catch (err){
            toast.error("Lỗi khi tạo sản phẩm")
        } finally {
            setLoading(false);
        }
    }
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
            <div className="flex justify-center items-center w-full">
                <div className="bg-white p-0 rounded-xl shadow-lg w-full max-w-7xl h-[90vh] overflow-y-auto border border-gray-200 relative">
                    {/* Sticky Header */}
                    <div className="sticky top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 shadow-md px-8 py-4">
                        <div className="relative flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FaTag className="text-blue-500" /> Cập nhật sản phẩm
                            </h2>
                            <button
                                className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                onClick={onClose}
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="space-y-10 px-8 pt-0 pb-8">
                        {/* Product Name */}
                        <div className="mb-4 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FaTag className="text-blue-500" /> <span>Tên sản phẩm</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 pl-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Nhập tên sản phẩm" 
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FaInfo className="text-blue-500" /> <span>Mô tả sản phẩm</span>
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Nhập mô tả chi tiết về sản phẩm"
                            ></textarea>
                        </div>

                        {/* Category */}
                        <div className="mt-10 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FaListUl className="text-blue-500" /> <span>Danh mục sản phẩm</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleChange("category", e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                >
                                    <option value="" disabled>Chọn danh mục sản phẩm</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Attributes */}
                        <div className="mt-10 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v6z" clipRule="evenodd" />
                                        <path d="M4 9h12v2H4z" />
                                    </svg>
                                    <span>Thuộc tính sản phẩm</span>
                                </label>
                            </div>
                            
                            {formData.attributes.map((attribute, attrIndex) => (
                                <div key={attrIndex} className="border border-gray-200 bg-gray-50 p-4 rounded-lg mb-4 relative shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-sm font-medium text-gray-700">Thuộc tính #{attrIndex + 1}</h3>
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-200 text-gray-800 cursor-not-allowed font-semibold"
                                            value={attribute.name}
                                            placeholder="Tên thuộc tính"
                                            disabled
                                            onChange={(e) =>
                                                handleArrayChange("attributes", attrIndex, e.target.value, "name")
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-xs text-gray-500 mb-1">Các giá trị của thuộc tính:</div>
                                        {attribute.values.map((value, valueIndex) => (
                                            <div key={valueIndex} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-200 text-gray-800 cursor-not-allowed font-semibold"
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
                        <div className="mt-10 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FaBoxes className="text-blue-500" /> <span>Biến thể sản phẩm</span>
                                </label>
                            </div>

                            <div className="space-y-10 pt-2">
                                {formData.productInstances.map((instance, instanceIndex) => (
                                    <div
                                        key={instanceIndex}
                                        className="p-4 border border-gray-200 bg-gray-50 rounded-lg relative shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <h3 className="text-sm font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">
                                            Biến thể #{instanceIndex + 1}
                                        </h3>

                                        {/* Attribute Values */}
                                        {formData.attributes.length > 0 && (
                                            <div className="mb-4 pt-4">
                                                <h4 className="text-xs text-gray-500 mb-2">Cấu hình sản phẩm:</h4>
                                                <div className="grid gap-3 md:grid-cols-2">
                                                    {formData.attributes.map((attribute, attrIndex) => (
                                                        <div key={attrIndex} className="">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                {attribute.name || `Thuộc tính ${attrIndex + 1}`}
                                                            </label>
                                                            <div className="relative">
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
                                                                    className="w-full border border-gray-300 rounded-lg p-2 appearance-none bg-gray-200 text-gray-800 cursor-not-allowed font-semibold"
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
                                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid gap-4 md:grid-cols-2">
                                            {/* Price */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                                    <FaDollarSign className="text-green-600" /> Giá tiền
                                                </label>
                                                <div className="relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">VNĐ</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                        value={instance.price}
                                                        placeholder="0"
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
                                            </div>

                                            {/* Quantity */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg> 
                                                    Số lượng
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    value={instance.quantityInStock}
                                                    placeholder="0"
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
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mt-8 flex justify-end">
                            <button
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 min-w-[160px] flex items-center justify-center gap-2"
                                onClick={handleCreateProduct}
                            >
                                {loading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin text-white text-xl" />
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                        <span>Cập nhật sản phẩm</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductModal;




