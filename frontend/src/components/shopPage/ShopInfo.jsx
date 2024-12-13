import { useState, useEffect } from "react";
import {updateInfo, getInforShop} from "../../fetchAPI/fetchShop";
import Cookies from "js-cookie";
import Title from "../Title.jsx";

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

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [commune, setCommune] = useState("");

  // Lấy thông tin cửa hàng
  const loadInfo = async () => {
    try {
      const response = await getInforShop(Cookies.get("username"));
      setShopInfo(response);
      setProvince(response.address.province || "");
      setDistrict(response.address.district || "");
      setCommune(response.address.commune || "");
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
    try {
      const updatedInfo = {
        shopName: shopInfo.shopName,
        address: {
          province,
          district,
          commune,
          specific_address: shopInfo.address.specific_address,
        },
      };

      const response = await updateInfo(Cookies.get("username"), updatedInfo);
      console.log("Sửa thông tin shop thành công!", response);
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      alert("Đã xảy ra lỗi trong quá trình lưu thông tin.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">
        <Title text1="Thông Tin" text2="Cửa Hàng"/>
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Thông tin cửa hàng */}
        <div className="col-span-2">
          <label className="block mb-2">Tên cửa hàng</label>
          <input
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={shopInfo.shopName}
            onChange={(e) => handleFieldChange("shopName", e.target.value)}
          />

          <label className="block mb-2">Đánh giá cửa hàng</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={shopInfo.rating}
            onChange={(e) => handleFieldChange("rating", e.target.value)}
            disabled
            step="0.1"
            min="0"
            max="5"
          />

          <label className="block mb-2">Số sản phẩm</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={shopInfo.numberOfProduct}
            onChange={(e) =>
              handleFieldChange("numberOfProduct", e.target.value)
            }
            disabled
          />

          <label className="block mb-2">Số người theo dõi</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={shopInfo.follower}
            onChange={(e) => handleFieldChange("follower", e.target.value)}
            disabled
          />
        </div>
        
        {/* Địa chỉ */}
        <div className="col-span-2">
          <label className="block mb-2">Tỉnh/Thành phố</label>
          <select
            value={province}
            onChange={handleProvinceChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">{province || "Chọn Tỉnh/Thành phố"}</option>
            {provinces.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <label className="block mb-2">Quận/Huyện</label>
          <select
            value={district}
            onChange={handleDistrictChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            disabled={!province}
          >
            <option value="">{district || "Chọn Quận/Huyện"}</option>
            {districts.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <label className="block mb-2">Xã/Phường</label>
          <select
            value={commune}
            onChange={handleCommuneChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            disabled={!district}
          >
            <option value="">{commune || "Chọn Xã/Phường"}</option>
            {wards.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <label className="block mb-2">Địa chỉ cụ thể</label>
          <input
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={shopInfo.address.specific_address}
            onChange={(e) =>
              setShopInfo({
                ...shopInfo,
                address: {
                  ...shopInfo.address,
                  specific_address: e.target.value,
                },
              })
            }
          />
        </div>

        <div className="col-span-2 text-center">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Lưu thông tin
          </button>
        </div>
    </div>
    </>
  );
};

export default ShopInfo;
