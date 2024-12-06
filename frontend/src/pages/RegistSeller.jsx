import { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { registSeller } from '../fetchAPI/fetchAccount';

const RegistSeller = () => {
  const { navigate } = useContext(ShopContext);
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [email, setEmail] = useState('');
  const [ten, setTen] = useState('');
  const [sdt, setSdt] = useState('');
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
  const [isLoading, setIsLoading] = useState(false);

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
    setProvinceCode(selectedCode); // Cập nhật mã tỉnh
    setProvince(selectedProvince?.name || ''); // Cập nhật tên tỉnh
    setDistrictCode('');
    setDistrict('');
    setWardCode('');
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


  const validateInputs = () => {
    if (!id.trim() || !pass.trim() || !confirmPass.trim() || !email.trim() || !province.trim() || 
        !ten.trim() || !sdt.trim() || !district.trim() || !ward.trim() || !detailAddress.trim()) {
      toast.error('Bạn còn sót thông tin nè!');
      return false;
    }

    const idRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
    if (!idRegex.test(id)) {
      toast.error('Tài khoản không hợp lệ! Tài khoản phải bắt đầu bằng chữ cái, chỉ chứa chữ cái, số, gạch dưới, và dài từ 4-20 ký tự.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ!');
      return false;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(sdt)) {
      toast.error('Số điện thoại không hợp lệ!');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,20}$/;
    if (!passwordRegex.test(pass)) {
      toast.error(
        "Mật khẩu cần từ 8-20 ký tự, bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt và không chứa khoảng trắng!"
      );
      return false;
    }


    if (pass !== confirmPass) {
      toast.error('Mật khẩu không khớp mất rùi :(((');
      return false;
    }

    return true;
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoading || !validateInputs()) return;

    setIsLoading(true);

    const body = {
      username: id.trim(),
      password: pass,
      shopName: ten.trim(),
      email: email.trim(),
      phone: sdt.trim(),
      province: province,
      district: district,
      ward: ward,
      detailAddress: detailAddress
    };

    try {
      await registSeller(body);
      toast.success('Đăng ký thành công!');
      navigate('/Login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      toast.error("Lỗi khi đăng kí cửa hàng!")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen border-t'>
      <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-10 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Đăng ký cửa hàng</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        <input type="text" className="w-full px-3 py-2 border border-gray-800" placeholder="Tài khoản" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="password" className="w-full px-3 py-2 border border-gray-800" placeholder="Mật khẩu" value={pass} onChange={(e) => setPass(e.target.value)} />
        <input type="password" className="w-full px-3 py-2 border border-gray-800" placeholder="Nhập lại mật khẩu" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
        <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Tên cửa hàng" value={ten} onChange={(e) => setTen(e.target.value)} />
        <input type="email" className="w-full px-3 py-2 border border-gray-800" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" className="w-full px-3 py-2 border border-gray-800" placeholder="Số điện thoại" value={sdt} onChange={(e) => setSdt(e.target.value)} />
                <select
                    value={provinceCode}
                    onChange={handleProvinceChange}
                    className="w-full px-3 py-2 border border-gray-800"
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
                    className="w-full px-3 py-2 border border-gray-800"
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
                    className="w-full px-3 py-2 border border-gray-800"
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
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <Link to="/Login">
            <p className="cursor-pointer hover:text-black hover:underline">Bạn đã có tài khoản?</p>
          </Link>
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className={`bg-black text-white font-light px-8 py-2 mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-2xl" /> : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
}

export default RegistSeller
