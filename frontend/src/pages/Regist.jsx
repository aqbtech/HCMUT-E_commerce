import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { register } from '../fetchAPI/fetchAccount';
import { toast } from 'react-toastify';
import ErrorMessage from '/src/components/errorMessage';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Cookies from 'js-cookie'


const Regist = () => {
  const { navigate, systemError, setSystemError } = useContext(ShopContext);

  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [email, setEmail] = useState('');
  const [hovatendem, setHovatendem] = useState('');
  const [ten, setTen] = useState('');
  const [sdt, setSdt] = useState('');
  const [date, setDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    if (!id.trim() || !pass.trim() || !confirmPass.trim() || !email.trim() || !hovatendem.trim() || !ten.trim() || !sdt.trim() || !date.trim()) {
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
      firstName: hovatendem.trim(),
      lastName: ten.trim(),
      email: email.trim(),
      phone: sdt.trim(),
      dob: date,
    };

    try {
      await register(body);
      toast.success('Đăng ký thành công!');
      navigate('/Login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      if (error.status === 401) toast.error('Thông tin hiện đã tồn tại!');
      else setSystemError(error.response?.data?.message || error.response?.data?.error || 'Mất kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  if (systemError) {
    return <ErrorMessage message={systemError} />;
  }

  return (
    <div>
      <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Đăng ký</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        <input type="text" className="w-full px-3 py-2 border border-gray-800" placeholder="Tài khoản" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="password" className="w-full px-3 py-2 border border-gray-800" placeholder="Mật khẩu" value={pass} onChange={(e) => setPass(e.target.value)} />
        <input type="password" className="w-full px-3 py-2 border border-gray-800" placeholder="Nhập lại mật khẩu" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
        <input type="email" className="w-full px-3 py-2 border border-gray-800" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="flex gap-3">
          <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Họ và tên đệm" value={hovatendem} onChange={(e) => setHovatendem(e.target.value)} />
          <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Tên" value={ten} onChange={(e) => setTen(e.target.value)} />
        </div>
        <input type="text" className="w-full px-3 py-2 border border-gray-800" placeholder="Số điện thoại" value={sdt} onChange={(e) => setSdt(e.target.value)} />
        <input type="date" className="w-full px-3 py-2 border border-gray-800" value={date} onChange={(e) => setDate(e.target.value)} />
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
};

export default Regist;
