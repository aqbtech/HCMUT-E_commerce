import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {getAllCategory} from "../../fetchAPI/fetchCategory.jsx";
import {createProduct, uploadIMG} from "../../fetchAPI/fetchProduct.jsx";
import {toast} from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Thêm sản phẩm</h2>

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

                        {/* IMG */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-800"
                                onChange={(e) => handleImageUpload(e.target.files)}
                            />
                            <div className="mt-4 flex gap-4 flex-wrap">
                                {images.map((image, index) => (
                                    <div key={index} className="relative w-32 h-32">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover rounded-md shadow-md"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 text-red-500 text-lg bg-white rounded-full"
                                        onClick={() => removeImage(index)}
                                    >
                                        &times;
                                    </button>
                                    </div>
                                ))}
                            </div>
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
                                    <button
                                        type="button"
                                        className="absolute top-0 right-1 text-red-500 text-4xl"
                                        onClick={() => removeAttribute(attrIndex)}
                                    >
                                        &times;
                                    </button>

                                    <div className="mt-4 mb-2">
                                        <input
                                            type="text"
                                            className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={attribute.name}
                                            placeholder="Tên thuộc tính"
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
                                                    className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    value={value}
                                                    placeholder="Giá trị thuộc tính"
                                                    onChange={(e) =>
                                                        handleArrayChange("attributes", attrIndex, e.target.value, "values", valueIndex)
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="text-red-500 text-4xl"
                                                    onClick={() => removeAttributeValue(attrIndex, valueIndex)}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className="text-blue-500 text-sm mt-2"
                                        onClick={() => addAttributeValue(attrIndex)}
                                    >
                                        + Thêm giá trị
                                    </button>
                                </div>
                            ))}

                            <button
                                className="text-blue-500 text-sm mt-4"
                                onClick={addAttribute}
                            >
                                + Thêm thuộc tính
                            </button>
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
                                                        className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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


                                    {/* Remove Button */}
                                    <button
                                        className="absolute top-0 right-1 text-red-500 text-4xl"
                                        onClick={() => removeField("productInstances", instanceIndex)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <button
                                className="text-blue-500 text-sm mt-4"
                                onClick={() =>
                                    addField("productInstances", {
                                        attributeValues: [""],
                                        price: "",
                                        quantityInStock: "",
                                    })
                                }
                            >
                                + Thêm sản phẩm cụ thể
                            </button>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                disabled={loading}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                                onClick={handleCreateProduct}
                            >
                                {loading ? ( <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-2xl" />) : (<div>Tạo sản phẩm</div>)}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
        ;
};

export default AddProductModal;




