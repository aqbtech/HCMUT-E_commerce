import { useState, useEffect } from "react";
import {updateInfo, getInforShop} from "../../fetchAPI/fetchShop";
import Cookies from "js-cookie";
import Title from "../Title.jsx";
import {toast} from "react-toastify";
import { FaEdit, FaSave, FaTimes, FaStore, FaStar, FaBox, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

const ShopInfo = () => {
  const [shopInfo, setShopInfo] = useState({
    shopName: "",
    rating: 0.0,
    numberOfProduct: 0,
    follower: 0,
    address: {
      province: "",
      district: "",
      commune: "",
      specific_address: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [shopName, setShopName] = useState(shopInfo.shopName)
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [commune, setCommune] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");

  // Lấy thông tin cửa hàng
  const loadInfo = async () => {
    try {
      const response = await getInforShop(Cookies.get("username"));
      setShopInfo(response);
      setShopName(response.shopName);
      setProvince(response.address.province || "");
      setDistrict(response.address.district || "");
      setCommune(response.address.commune || "");
      setSpecificAddress(response.address.specific_address || "");
    } catch (err) {
      console.error("Lỗi khi tải thông tin cửa hàng:", err);
    }
  };

  useEffect(() => {
    loadInfo();
  }, []);

  // Fetch danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/?depth=1");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setDistrict("");
    setCommune("");
    setDistricts([]);
    setWards([]);

    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinces.find((p) => p.name === selectedProvince)?.code}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận/huyện:", error);
    }
  };

  const handleDistrictChange = async (e) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    setCommune("");
    setWards([]);

    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districts.find((d) => d.name === selectedDistrict)?.code}?depth=2`
      );
      const data = await response.json();
      setWards(data.wards || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xã/phường:", error);
    }
  };

  const handleCommuneChange = (e) => {
    setCommune(e.target.value);
  };

  const handleSave = async () => {
    if(!shopName) return toast.error("Vui lòng nhập tên shop!")
    try {
      const updatedInfo = {
        shopName: shopName,
        address: {
          province,
          district,
          commune,
          specific_address: specificAddress,
        },
      };

      const response = await updateInfo(Cookies.get("username"), updatedInfo);
      console.log("Sửa thông tin shop thành công!", response);
      toast.success("Cập nhật thành công!")
      setIsEditing(false);
      loadInfo();
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      toast.error("Đã xảy ra lỗi trong quá trình lưu thông tin.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadInfo(); // Reset về giá trị ban đầu
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          <Title text1="Thông Tin" text2="Cửa Hàng"/>
        </h2>
        {!isEditing ? (
          <button 
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <FaEdit /> Chỉnh sửa
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              onClick={handleCancel}
            >
              <FaTimes /> Hủy
            </button>
            <button 
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              onClick={handleSave}
            >
              <FaSave /> Lưu thông tin
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Thông tin cơ bản */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 border-b pb-2">
            <FaStore className="text-blue-500" /> Thông tin cơ bản
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Tên cửa hàng</label>
              <input
                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg transition-colors`}
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                <FaStar className="text-yellow-500" /> Đánh giá cửa hàng
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                value={shopInfo.rating}
                disabled
                step="0.1"
                min="0"
                max="5"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                <FaBox className="text-blue-500" /> Số sản phẩm
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                value={shopInfo.numberOfProduct}
                disabled
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                <FaUsers className="text-green-500" /> Số người theo dõi
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                value={shopInfo.follower}
                disabled
              />
            </div>
          </div>
        </div>
        
        {/* Địa chỉ */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 border-b pb-2">
            <FaMapMarkerAlt className="text-red-500" /> Địa chỉ cửa hàng
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Tỉnh/Thành phố</label>
              <select
                value={province}
                onChange={handleProvinceChange}
                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg`}
                disabled={!isEditing}
              >
                <option value="">{province || "Chọn Tỉnh/Thành phố"}</option>
                {provinces.map((item) => (
                  <option key={item.code} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Quận/Huyện</label>
              <select
                value={district}
                onChange={handleDistrictChange}
                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg`}
                disabled={!isEditing || !province}
              >
                <option value="">{district || "Chọn Quận/Huyện"}</option>
                {districts.map((item) => (
                  <option key={item.code} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Xã/Phường</label>
              <select
                value={commune}
                onChange={handleCommuneChange}
                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg`}
                disabled={!isEditing || !district}
              >
                <option value="">{commune || "Chọn Xã/Phường"}</option>
                {wards.map((item) => (
                  <option key={item.code} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Địa chỉ cụ thể</label>
              <input
                className={`w-full p-2 border ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-100'} rounded-lg transition-colors`}
                value={specificAddress}
                onChange={(e) => setSpecificAddress(e.target.value)}
                disabled={!isEditing}
                placeholder="Số nhà, tên đường, v.v..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
