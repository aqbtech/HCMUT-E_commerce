import { useState, useEffect } from "react";

const RegistSeller = ({ data, onSave }) => {
    const [shopName, setShopName] = useState('');
    const [provinceCode, setProvinceCode] = useState('');
    const [province, setProvince] = useState('');
    const [districtCode, setDistrictCode] = useState('');
    const [district, setDistrict] = useState('');
    const [wardCode, setWardCode] = useState('');
    const [ward, setWard] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Fetch danh sách tỉnh/thành phố
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/?depth=1');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tỉnh:', error);
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e) => {
        const selectedCode = Number(e.target.value);
        const selectedProvince = provinces.find(item => item.code === selectedCode);
        setProvinceCode(selectedCode);
        setProvince(selectedProvince?.name || '');
        setDistrictCode('');
        setDistrict('');
        setWardCode('');
        setWard('');
        setWards([]);

        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedCode}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts || []);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách quận/huyện:', error);
        }
    };

    const handleDistrictChange = async (e) => {
        const selectedCode = Number(e.target.value);
        const selectedDistrict = districts.find(item => item.code === selectedCode);
        setDistrictCode(selectedCode);
        setDistrict(selectedDistrict?.name || '');
        setWardCode('');
        setWard('');

        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedCode}?depth=2`);
            const data = await response.json();
            setWards(data.wards || []);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách xã/phường:', error);
        }
    };

    const handleWardChange = (e) => {
        const selectedCode = Number(e.target.value);
        const selectedWard = wards.find(item => item.code === selectedCode);
        setWardCode(selectedCode);
        setWard(selectedWard?.name || '');
    };

    const handleSave = () => {
        const sellerData = {
            shopName,
            province,
            district,
            ward,
            detailAddress,
        };
        onSave(sellerData);
    };

    return (data ?  
        (<h2 className="text-2xl font-bold mb-4 text-center mt-10 text-red-500">
            Đăng kí của bạn đang được xử lý, vui lòng đợi thông báo!
        </h2>
          

        )
        : (<div className="">
            <div className="">
                <h2 className="text-2xl font-bold mb-4">Đăng ký người bán</h2>

                <input
                    type="text"
                    placeholder="Tên cửa hàng"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <select
                    value={provinceCode}
                    onChange={handleProvinceChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                >
                    <option value="">{province || 'Chọn Tỉnh/Thành phố'}</option>
                    {provinces.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <select
                    value={districtCode}
                    onChange={handleDistrictChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    disabled={!provinceCode}
                >
                    <option value="">{district || 'Chọn Quận/Huyện'}</option>
                    {districts.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <select
                    value={wardCode}
                    onChange={handleWardChange}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    disabled={!districtCode}
                >
                    <option value="">{ward || 'Chọn Xã/Phường'}</option>
                    {wards.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Địa chỉ cụ thể"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <div className="flex justify-between">  
                    <button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 rounded">
                        Đăng ký
                    </button>
                </div>
            </div>
        </div>)
        
    );
};

export default RegistSeller;
