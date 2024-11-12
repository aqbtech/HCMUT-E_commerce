import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { resetPassword } from "../fetchAPI/fetchAccount";
import { toast } from "react-toastify";
import ErrorMessage  from '/src/components/errorMessage';

const ResetPassword = () => {
  const { navigate, systemError, setSystemError } = useContext(ShopContext);

  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const onSubmitHandler = async (event) => {
    event.preventDefault(); 
    if (isLoading) return;
    if (!username || !pass || !confirmPass || !email) {
      toast.error("Bạn còn sót thông tin nè!");
      return;
    }

    if (pass !== confirmPass) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    
    setIsLoading(true);

    const body = {
      "username" : username,
      "newPassword": pass,
      "email" : email
    };

    try {
      await resetPassword(body);
      toast.success("Đã reset mật khẩu thành công");
      navigate("/Login");
    } catch (error) {
      if(error.status === 401) toast.error("Thông tin không đúng!");
      else if(error.status === 404) toast.error("Tài khoản không tồn tại!");
      else setSystemError(error.response?.data?.message || error.response?.data?.error || "Mất kết nối máy chủ");
      throw(error)
    } finally {
      setIsLoading(false);
    }
  };  
  if (systemError) {
    return <ErrorMessage  message={systemError} />;
  }
  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Lấy lại mật khẩu</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Tài khoản"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Mật khẩu mới"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <Link to="/login">
            <p className="cursor-pointer hover:text-black hover:underline">
              Đăng Nhập
            </p>
          </Link>
        </div>
        <button
          type="submit"
          className="bg-black text-white font-light px-8 py-2 mt-4"
        >
        {isLoading ? "...Loading" : "Xác nhận"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
