import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {getAllCategory} from "../../fetchAPI/fetchCategory.jsx";
import {createProduct, uploadIMG} from "../../fetchAPI/fetchProduct.jsx";
import {toast} from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaTag, FaInfo, FaImages, FaListUl, FaDollarSign, FaBoxes, FaTimes, FaPlus } from "react-icons/fa";
import { BsFillTrashFill } from "react-icons/bs";
const AddProductModal = ({isOpen, onClose}) => {
    const [formData, setFormData] = useState({
        username: Cookies.get('username'),
        name: "",
        description: "",
        category: "",
        attributes: [],
        productInstances: [
            { attributeValues: [""], price: "", quantityInStock: "" },
        ],
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);  // Lưu danh sách categories
    const [loading, setLoading] = useState(false);

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
    const addField = (field, newItem) => {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));
    };

    const removeField = (field, index) => {
        setFormData((prev) => {
            const updatedArray = [...prev[field]];
            updatedArray.splice(index, 1); // Xóa phần tử tại vị trí index
            return { ...prev, [field]: updatedArray };
        });
    };

    const syncAttributeValues = (updatedAttributes, prevInstances) => {
        return prevInstances.map((instance) => {
            const updatedValues = [...instance.attributeValues];
            const diff = updatedAttributes.length - updatedValues.length;

            if (diff > 0) {
                // Thêm giá trị trống nếu có thêm thuộc tính
                for (let i = 0; i < diff; i++) {
                    updatedValues.push("");
                }
            } else if (diff < 0) {
                // Xóa giá trị nếu thuộc tính bị xóa
                updatedValues.splice(diff);
            }

            return { ...instance, attributeValues: updatedValues };
        });
    };

    const addAttribute = () => {
        setFormData((prev) => {
            const updatedAttributes = [...prev.attributes, { name: "", values: [""] }];
            const updatedProductInstances = syncAttributeValues(updatedAttributes, prev.productInstances);

            return { ...prev, attributes: updatedAttributes, productInstances: updatedProductInstances };
        });
    };

    // Hàm xóa thuộc tính
    const removeAttribute = (index) => {
        setFormData((prev) => {
            const updatedAttributes = [...prev.attributes];
            updatedAttributes.splice(index, 1);

            const updatedProductInstances = syncAttributeValues(updatedAttributes, prev.productInstances);

            return { ...prev, attributes: updatedAttributes, productInstances: updatedProductInstances };
        });
    };

    // Hàm thêm giá trị vào values của thuộc tính
    const addAttributeValue = (attrIndex) => {
        const newAttributes = [...formData.attributes];
        newAttributes[attrIndex].values.push("");  // Thêm một giá trị trống vào mảng
        setFormData({ ...formData, attributes: newAttributes });
        console.log(formData);
    };

    // Hàm xóa giá trị trong thuộc tính
    const removeAttributeValue = (attrIndex, valueIndex) => {
        setFormData((prev) => {
            const updatedAttributes = [...prev.attributes];
            updatedAttributes[attrIndex].values.splice(valueIndex, 1);
            return { ...prev, attributes: updatedAttributes };
        });
        console.log(formData);
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
        if(!formData.name.trim()){
            toast.error("Vui lòng nhâp tên sản phẩm")
            return;
        }

        if(!formData.category.trim()){
            toast.error("Vui lòng chọn danh mục sản phẩm")
            return;
        }


        for(let i = 0; i < formData.attributes.length; i++){
            if(formData.attributes[i].name === "") {
                toast.error("Vui lòng nhập tên thuộc tính");
                return;
            }
            else{
                for (let j = 0; j < formData.attributes[i].values.length; j++){
                    if(formData.attributes[i].values[j] ===""){
                        toast.error("Vui lòng nhập giá trị cho thuộc tính");
                        return;
                    }
                }
            }
        }

        if(formData.attributes.length === 0) {
            if(formData.productInstances.length === 0)
            {
                toast.error("Phải có một sản phẩm cụ thể")
                return;
            }
            else if (formData.productInstances.length > 1)
            {
                toast.error("Chỉ được tạo một sản phẩm cụ thể")
                return;
            }
        }

        if (formData.attributes.length > 0) {
            let x = 1;
            // Duyệt qua tất cả các attributes và tính số lượng sản phẩm tối đa
            for (let i = 0; i < formData.attributes.length; i++) {
                x *= formData.attributes[i].values.length;  // Nhân số giá trị của mỗi attribute
            }

            // Kiểm tra nếu số lượng productInstances vượt quá số sản phẩm tối đa có thể tạo
            if (formData.productInstances.length > x) {
                toast.error("Chỉ được tạo tối đa " + x + " sản phẩm cụ thể");
                return;
            }
        }



        for(let i = 0; i < formData.productInstances.length; i++){
            if(formData.productInstances.length !== 1) {
                for(let j = 0; j < formData.productInstances[i].attributeValues.length; j++){
                    if(formData.productInstances[i].attributeValues[j] === "") {
                        toast.error("Vui lòng nhập chọn giá trị thuộc tính cho sản phẩm")
                        return;
                    }
                }
            }
            if(formData.productInstances[i].price === "" ){
                toast.error("Vui lòng nhập giá tiền cho sản phẩm");
                return;
            }
            if(formData.productInstances[i].quantityInStock === "" ) {
                toast.error("Vui lòng nhập số lượng cho sản phẩm");
                return;
            }
        }

        for (let i = 0; i < formData.productInstances.length; i++) {
            for (let j = i + 1; j < formData.productInstances.length; j++) {
                if (JSON.stringify(formData.productInstances[i].attributeValues) === JSON.stringify(formData.productInstances[j].attributeValues)) {
                    toast.error("Sản phẩm cụ thể bị lặp");
                    return;
                }
            }
        }

        if(images.length === 0) {
            return toast.error("Hình ảnh sản phẩm còn đang trống!");
        }
        setLoading(true)
        try {
            const responseProductId = await createProduct(formData);
            const uploadPromises = images.map((image) =>
                uploadIMG(image, responseProductId.productId)
            );
            await Promise.all(uploadPromises);
            console.log('Tất cả ảnh đã upload thành công!');
            toast.success("Tạo sản phẩm thành công");
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
            setImages([])

        } catch (err){
            toast.error("Lỗi khi tạo sản phẩm")
            throw err;
        }
        finally{
            setLoading(false)
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
                                <FaTag className="text-blue-500" /> Thêm sản phẩm mới
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

                        {/* IMG */}
                        <div className="mt-10 bg-gray-50 p-5 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FaImages className="text-blue-500" /> <span>Hình ảnh sản phẩm</span>
                            </label>
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex justify-center text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Tải lên hình ảnh</span>
                                            <input 
                                                type="file" 
                                                className="sr-only" 
                                                accept="image/*" 
                                                multiple 
                                                onChange={(e) => handleImageUpload(e.target.files)}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF - Tối đa 5MB</p>
                                </div>
                            </div>
                            
                            {images.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">Hình ảnh đã chọn ({images.length}):</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative group overflow-hidden rounded-lg shadow-md border border-gray-200">
                                                <div className="aspect-w-1 aspect-h-1 w-full">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Preview ${index}`}
                                                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <BsFillTrashFill size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                <button
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                    onClick={addAttribute}
                                >
                                    <FaPlus size={14} /> Thêm thuộc tính
                                </button>
                            </div>
                            
                            {formData.attributes.length === 0 ? (
                                <div className="p-4 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                    <p className="text-gray-500 mb-2">Chưa có thuộc tính nào được thêm</p>
                                    <button 
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200 inline-flex items-center gap-1"
                                        onClick={addAttribute}
                                    >
                                        <FaPlus size={14} /> Thêm thuộc tính đầu tiên
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.attributes.map((attribute, attrIndex) => (
                                        <div key={attrIndex} className="border border-gray-200 bg-gray-50 p-4 rounded-lg mb-4 relative shadow-sm">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-sm font-medium text-gray-700">Thuộc tính #{attrIndex + 1}</h3>
                                                <button
                                                    type="button"
                                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                                                    onClick={() => removeAttribute(attrIndex)}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>

                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    value={attribute.name}
                                                    placeholder="Tên thuộc tính (ví dụ: Màu sắc, Kích thước, ...)"
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
                                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                            value={value}
                                                            placeholder={`Giá trị thuộc tính ${attribute.name || ''} (ví dụ: Đỏ, Xanh, ...)`}
                                                            onChange={(e) =>
                                                                handleArrayChange("attributes", attrIndex, e.target.value, "values", valueIndex)
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                                                            onClick={() => removeAttributeValue(attrIndex, valueIndex)}
                                                        >
                                                            <FaTimes size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                onClick={() => addAttributeValue(attrIndex)}
                                            >
                                                <FaPlus size={12} /> Thêm giá trị
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Product Instances */}
                        <div className="mt-10 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FaBoxes className="text-blue-500" /> <span>Biến thể sản phẩm</span>
                                </label>
                                <button
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                    onClick={() =>
                                        addField("productInstances", {
                                            attributeValues: [""],
                                            price: "",
                                            quantityInStock: "",
                                        })
                                    }
                                >
                                    <FaPlus size={14} /> Thêm biến thể
                                </button>
                            </div>

                            {formData.productInstances.length === 0 ? (
                                <div className="p-4 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                    <p className="text-gray-500 mb-2">Chưa có biến thể sản phẩm nào được thêm</p>
                                    <button 
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200 inline-flex items-center gap-1"
                                        onClick={() =>
                                            addField("productInstances", {
                                                attributeValues: [""],
                                                price: "",
                                                quantityInStock: "",
                                            })
                                        }
                                    >
                                        <FaPlus size={14} /> Thêm biến thể đầu tiên
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-10 pt-2">
                                    {formData.productInstances.map((instance, instanceIndex) => (
                                        <div
                                            key={instanceIndex}
                                            className="p-4 border border-gray-200 bg-gray-50 rounded-lg relative shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="absolute top-3 right-3">
                                                <button
                                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-full transition-colors duration-200"
                                                    onClick={() => removeField("productInstances", instanceIndex)}
                                                >
                                                    <FaTimes size={16} />
                                                </button>
                                            </div>

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
                                                                        className="w-full border border-gray-300 rounded-lg p-2 appearance-none bg-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                                    >
                                                                        <option value="" disabled>Chọn giá trị</option>
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
                            )}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 min-w-[160px] flex items-center justify-center gap-2"
                                onClick={handleCreateProduct}
                            >
                                {loading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin text-white text-xl" />
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>Tạo sản phẩm</span>
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

export default AddProductModal;




